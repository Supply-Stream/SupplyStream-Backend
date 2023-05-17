import express, { Request, Response } from "express";
import admin from "../../config/firebase";
import { client } from "../../config/axiom";
import addContainer from "../helpers/add-container";
const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const oldContainerID = req.query.oldContainerID as string;
  const newContainerID = req.query.newContainerID as string;
  const shippingLine = req.query.shippingLine as string;

  if (!newContainerID || !newContainerID || !shippingLine) {
    res.status(400).send({ error: "missing containerID or newContainerID" });
    return;
  }

  let checkIfContainerExists = await admin
    .firestore()
    .collection("containers")
    .doc(newContainerID)
    .get();

  if (checkIfContainerExists.exists) {
    res.status(409).send({ error: "container already exists" });
    return;
  }

  let OG_CONTAINER = await admin
    .firestore()
    .collection("containers")
    .doc(oldContainerID)
    .get();
  let OG_CONTAINER_DATA = OG_CONTAINER.data();

  OG_CONTAINER_DATA["template"]["CONTAINER"] = newContainerID;
  OG_CONTAINER_DATA["template"]["SHIPPING LINE"] = shippingLine;
  OG_CONTAINER["shippingLine"] = shippingLine;
  OG_CONTAINER["dateAdded"] = new Date();

  await admin
    .firestore()
    .collection("containers")
    .doc(newContainerID)
    .set(OG_CONTAINER_DATA);

  await addContainer(shippingLine, newContainerID, true);
});

export default router;
