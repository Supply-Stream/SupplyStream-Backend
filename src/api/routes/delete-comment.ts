import express, { Request, Response } from "express";
import admin from "../../config/firebase";
const router = express.Router();

router.delete("/", async (req: Request, res: Response) => {
  let { column, container }: { column: string; container: string } = req.body;

  if (!column || !container || column == "" || container == "") {
    res.status(400).send({
      error: "missing parts or all of request body",
    });
    return;
  }

  let commentQuery = await admin
    .firestore()
    .collection("containers")
    .doc(container)
    .collection("comments")
    .where("column", "==", column)
    .where("container", "==", container)
    .get();
  let commentDocs = commentQuery.docs;

  if (commentDocs.length == 0) {
    res.status(400).send({
      error: "no comments found",
    });
    return;
  } else {
    for (let doc of commentDocs) {
      await admin
        .firestore()
        .collection("containers")
        .doc(container)
        .collection("comments")
        .doc(doc.id)
        .delete();

      await admin
        .firestore()
        .collection("containers")
        .doc(container)
        .update({
          hasComments: admin.firestore.FieldValue.increment(-1),
        });
    }
    res.status(200).send({
      success: "comments deleted",
    });
    return;
  }
});

export default router;
