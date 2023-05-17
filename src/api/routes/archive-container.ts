import express, { Request, Response } from "express";
import admin from "../../config/firebase";
import { client } from "../../config/axiom";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  const containerID = req.body.containerID as string;

  if (!containerID) {
    res.status(400).send({ error: "missing containerID" });
  }

  try {
    // create document and subcollection refs
    let docRef = await admin
      .firestore()
      .collection("containers")
      .doc(containerID);
    let subCollectionRef = await docRef.collection("events");
    let commentsRef = await docRef.collection("comments");

    // get the document and subcollections
    let doc = await docRef.get();
    let subCollection = await subCollectionRef.get();
    let commentCollection = await commentsRef.get();

    // create a new document in the archive collection
    await admin
      .firestore()
      .collection("archives")
      .doc(containerID)
      .set(doc.data());

    // create a new subcollection in the archive collection
    if (!subCollection.empty) {
      for (let eventDoc of subCollection.docs) {
        await admin
          .firestore()
          .collection("archives")
          .doc(containerID)
          .collection("events")
          .add(eventDoc.data());

        // delete the subcollection document
        await eventDoc.ref.delete();
      }
    }

    if (!commentCollection.empty) {
      for (let commentDoc of commentCollection.docs) {
        await admin
          .firestore()
          .collection("archives")
          .doc(containerID)
          .collection("comments")
          .add(commentDoc.data());

        // delete the subcollection document
        await commentDoc.ref.delete();
      }
    }

    // delete the document
    await docRef.delete();

    res.sendStatus(200);
  } catch (error) {
    await client.ingestEvents("supplystream-errors", [
      { error: error, originEndpoint: "add-multiple-containers" },
    ]);
  }
});

export default router;
