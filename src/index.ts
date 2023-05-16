import { config } from "dotenv";
import express from "express";
import getWorkbook from "./api/routes/get-workbook";
import deleteComment from "./api/routes/delete-comment";
import cors from "cors";
import bodyParser from "body-parser";
config();

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/get-workbook", getWorkbook);

app.use("/delete-comment", deleteComment);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
