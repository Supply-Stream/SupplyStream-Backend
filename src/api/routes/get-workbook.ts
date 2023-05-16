import express, { Request, Response } from "express";
import path from "path";
import fs from "fs";
import admin from "../../config/firebase";
import excel from "exceljs";
import { client } from "../../config/axiom";
const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const company: string = req.query.company as string;

  try {
    // get all containers where company == company
    let containerQuery = await admin
      .firestore()
      .collection("containers")
      .where("company", "==", company)
      .get();

    // get all ARCHIVED containers where company == company
    let archiveQuery = await admin
      .firestore()
      .collection("archives")
      .where("company", "==", company)
      .get();

    // get template document
    let templateQuery = await admin
      .firestore()
      .collection("templates")
      .where("company", "==", company)
      .get();

    if (containerQuery.empty || templateQuery.empty) {
      res.status(400).send({ error: "no containers || template" });
      return;
    }

    // template data
    let templateData = templateQuery.docs[0].data();

    // create a new workbook
    const workbook = new excel.Workbook();

    // create active sheet
    const worksheet = workbook.addWorksheet("Active");

    // add header row
    let excelHeaders = templateData.template.map((column) => {
      return column["Header"];
    });
    worksheet.addRow(excelHeaders);

    // add cell rows
    containerQuery.docs.forEach((doc) => {
      let containerTemplate = doc.data().template;

      let formattedRow = excelHeaders.map((header) => {
        return containerTemplate[header];
      });
      worksheet.addRow(formattedRow);
    });

    // create archive sheet
    const archiveWorksheet = workbook.addWorksheet("Archives");

    let archiveHeaders = templateData.template.map((column) => {
      return column["Header"];
    });
    archiveWorksheet.addRow(archiveHeaders);

    // add cell rows
    archiveQuery.docs.forEach((doc) => {
      let containerTemplate = doc.data().template;

      let formattedRow = excelHeaders.map((header) => {
        return containerTemplate[header];
      });
      archiveWorksheet.addRow(formattedRow);
    });

    const filename = "SupplyStream.xlsx";
    const filePath = path.join(__dirname, "..", filename);
    await workbook.xlsx.writeFile(filePath);

    // set headers to trigger a download in the browser
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);

    // delete the file after it's sent to the client
    res.sendFile(filePath, () => {
      // delete the file after it's sent to the client
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(err);
        }
      });
    });
  } catch (error) {
    await client.ingestEvents("supplystream-errors", [{ error: error }]);
    res.sendStatus(400).send({
      error: "error getting workbook",
      originEndpoint: "get-workbook",
    });
  }
});

export default router;
