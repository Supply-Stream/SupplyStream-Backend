import express, { Request, Response } from "express";
import admin from "../../config/firebase";
import { client } from "../../config/axiom";
import addContainer from "../helpers/add-container";

const router = express.Router();

interface RequestBody {
  containerIDs: string;
  shippingLine: string;
  company: string;
  bol: string;
}

router.post("/", async (req: Request, res: Response) => {
  const { containerIDs, shippingLine, company, bol }: RequestBody = req.body;

  if (!containerIDs || !shippingLine || !company || !bol) {
    res
      .status(400)
      .send({ error: "missing containers || shippingLine || company" });
    return;
  }

  let parsedContainerIDs = JSON.parse(containerIDs);

  let templateDocResp = await admin
    .firestore()
    .collection("templates")
    .where("company", "==", company)
    .get();

  for (let containerID of parsedContainerIDs) {
    let containerTemplate = {};

    templateDocResp.docs[0].data()?.template?.forEach((item) => {
      switch (item?.Header) {
        case "CONTAINER":
          containerTemplate[item?.Header] = containerID;
          break;
        case "SHIPPING LINE":
          containerTemplate[item?.Header] = shippingLine;
          break;
        case "AUTOMATED":
          if (
            shippingLine == "MSC" ||
            shippingLine == "MAERSK" ||
            shippingLine == "ZIM" ||
            shippingLine == "ONE" ||
            shippingLine == "COSCO"
          ) {
            containerTemplate[item?.Header] = "true";
          } else {
            containerTemplate[item?.Header] = "false";
          }
          break;
        case "MBL #":
          containerTemplate[item?.Header] = bol;
          break;
        default:
          containerTemplate[item?.Header] = "N/A";
          break;
      }
    });

    const containerObject = {
      template: {
        ...containerTemplate,
      },
      members: [],
      company: company,
      shippingLine: shippingLine,
      dateAdded: new Date(),
    };

    let doc = await admin
      .firestore()
      .collection("containers")
      .doc(containerID)
      .get();

    if (doc.exists) {
      res.status(409).send({ error: "container already exists" });
      return;
    }
    await admin
      .firestore()
      .collection("containers")
      .doc(containerID)
      .set(containerObject);

    try {
      await addContainer(shippingLine, containerID, true);
    } catch (error) {
      await client.ingestEvents("supplystream-errors", [
        { error: error, originEndpoint: "add-multiple-containers" },
      ]);
      res.status(400).send({ error: error });
      return;
    }
  }
  res.sendStatus(200);
});

export default router;
