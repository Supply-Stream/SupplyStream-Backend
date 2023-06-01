import express, { Request, Response } from "express";
import admin from "../../config/firebase";
import { client } from "../../config/axiom";
import addContainer from "../helpers/add-container";
const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  if (!req.query.company) {
    res.send("No company provided");
    return;
  }

  let query = await admin
    .firestore()
    .collection("feed")
    .where("company", "==", req.query.company)
    .get();
  let docData = query.docs.map((doc) => doc.data());
  res.send(docData);
});

export default router;
