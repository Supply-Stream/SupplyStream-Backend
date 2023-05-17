import express, { Request, Response } from "express";
import admin from "../../config/firebase";
import { client } from "../../config/axiom";
import addContainer from "../helpers/add-container";

const router = express.Router();

interface RequestBody {
  containerID: string;
  shippingLine: string;
  members: string[];
  company: string;
}

router.post("/", async (req: Request, res: Response) => {
  const { containerID, shippingLine, members, company }: RequestBody = req.body;

  if (!containerID || !shippingLine || !members || !company) {
    res
      .status(400)
      .send({ error: "missing containerID || shippingLine || members" });
    return;
  }

  let templateDocResp = await admin
    .firestore()
    .collection("templates")
    .where("company", "==", company)
    .get();

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
          shippingLine === "COSCO"
        ) {
          containerTemplate[item?.Header] = "true";
        } else {
          containerTemplate[item?.Header] = "false";
        }
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
    members: members,
    company: company,
    shippingLine: shippingLine,
    dateAdded: new Date(),
  };

  let containerDocExists = await admin
    .firestore()
    .collection("containers")
    .doc(containerID)
    .get();

  if (containerDocExists.exists) {
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
    res.sendStatus(200);
  } catch (error) {
    await client.ingestEvents("supplystream-errors", [
      { error: error, originEndpoint: "add-new-container" },
    ]);
    res.status(400).send({ error: error });
  }
});

export default router;
