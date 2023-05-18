import { config } from "dotenv";
import cors from "cors";
import cron from "node-cron";
import bodyParser from "body-parser";
import express from "express";
import getWorkbook from "./api/routes/get-workbook";
import deleteComment from "./api/routes/delete-comment";
import duplicateContainer from "./api/routes/duplicate-container";
import addNewContainer from "./api/routes/add-new-container";
import addMultipleContainers from "./api/routes/add-multiple-containers";
import getContainerEvents from "./api/routes/get-container-events";
import archiveContainer from "./api/routes/archive-container";
import updateAllContainers from "./cron/update-all-containers";
import addContainer from "./api/helpers/add-container";

config();
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

cron.schedule("0 7,13 * * *", async () => {
  updateAllContainers();
});

app.use("/get-workbook", getWorkbook);

app.use("/delete-comment", deleteComment);

app.use("/duplicate-container", duplicateContainer);

app.use("/add-new-container", addNewContainer);

app.use("/add-multiple-containers", addMultipleContainers);

app.use("/get-container-events", getContainerEvents);

app.use("/archive-container", archiveContainer);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
