import express, { Request, Response } from "express";
import excel from "exceljs";
import multer from "multer";
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("file"), async (req: Request, res: Response) => {
  try {
    const workbook = new excel.Workbook();
    await workbook.xlsx.load(req.file.buffer); // load excel file
    const worksheet = workbook.getWorksheet(1); // get first worksheet

    const data = [];
    worksheet.eachRow((row, rowNumber) => {
      data.push(row.values); // push each row's data into data array
    });
  } catch (error) {}
});

export default router;
