import express, { Request, Response } from "express";
import admin from "../../config/firebase";
import { client } from "../../config/axiom";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const containerID = req.query.containerID as string;
  const active = req.query.active as string;

  let shippingLine: string;
  // find the shipping line
  let shippingLineResponse = await admin
    .firestore()
    .collection(active === "true" ? "containers" : "archives")
    .doc(containerID)
    .get();

  if (shippingLineResponse.exists) {
    shippingLine = shippingLineResponse.data().shippingLine;
  }

  let allContainerEvents = await admin
    .firestore()
    .collection(active === "true" ? "containers" : "archives")
    .doc(containerID)
    .collection("events")
    .get();

  let rawEvents = [];

  allContainerEvents.docs.forEach((doc) => {
    rawEvents.push(doc.data());
  });

  res.send({
    events: rawEvents,
    shippingLine: shippingLine,
  });
});

export default router;
