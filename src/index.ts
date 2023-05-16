import { config } from "dotenv";
import express from "express";
import getWorkbook from "./api/routes/get-workbook";
config();

const app = express();

app.use("/get-workbook", getWorkbook);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
