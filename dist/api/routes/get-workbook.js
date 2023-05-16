"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const firebase_1 = __importDefault(require("../../config/firebase"));
const exceljs_1 = __importDefault(require("exceljs"));
const axiom_1 = require("../../config/axiom");
const router = express_1.default.Router();
router.get("/", async (req, res) => {
    const company = req.query.company;
    try {
        // get all containers where company == company
        let containerQuery = await firebase_1.default
            .firestore()
            .collection("containers")
            .where("company", "==", company)
            .get();
        // get all ARCHIVED containers where company == company
        let archiveQuery = await firebase_1.default
            .firestore()
            .collection("archives")
            .where("company", "==", company)
            .get();
        // get template document
        let templateQuery = await firebase_1.default
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
        const workbook = new exceljs_1.default.Workbook();
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
        const filePath = path_1.default.join(__dirname, "..", filename);
        await workbook.xlsx.writeFile(filePath);
        // set headers to trigger a download in the browser
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
        // delete the file after it's sent to the client
        res.sendFile(filePath, () => {
            // delete the file after it's sent to the client
            fs_1.default.unlink(filePath, (err) => {
                if (err) {
                    console.error(err);
                }
            });
        });
    }
    catch (error) {
        await axiom_1.client.ingestEvents("supplystream-errors", [{ error: error }]);
        res.sendStatus(400).send({
            error: "error getting workbook",
            originEndpoint: "get-workbook",
        });
    }
});
exports.default = router;
//# sourceMappingURL=get-workbook.js.map