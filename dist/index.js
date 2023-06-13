"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const cors_1 = __importDefault(require("cors"));
const node_cron_1 = __importDefault(require("node-cron"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const get_workbook_1 = __importDefault(require("./api/routes/get-workbook"));
const delete_comment_1 = __importDefault(require("./api/routes/delete-comment"));
const duplicate_container_1 = __importDefault(require("./api/routes/duplicate-container"));
const add_new_container_1 = __importDefault(require("./api/routes/add-new-container"));
const add_multiple_containers_1 = __importDefault(require("./api/routes/add-multiple-containers"));
const get_container_events_1 = __importDefault(require("./api/routes/get-container-events"));
const archive_container_1 = __importDefault(require("./api/routes/archive-container"));
const update_all_containers_1 = __importDefault(require("./cron/update-all-containers"));
const get_feed_1 = __importDefault(require("./api/routes/get-feed"));
const import_bulk_data_1 = __importDefault(require("./api/routes/import-bulk-data"));
(0, dotenv_1.config)();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
node_cron_1.default.schedule("0 7,13,20 * * *", async () => {
    (0, update_all_containers_1.default)();
});
app.use("/get-workbook", get_workbook_1.default);
app.use("/delete-comment", delete_comment_1.default);
app.use("/duplicate-container", duplicate_container_1.default);
app.use("/add-new-container", add_new_container_1.default);
app.use("/add-multiple-containers", add_multiple_containers_1.default);
app.use("/get-container-events", get_container_events_1.default);
app.use("/archive-container", archive_container_1.default);
app.use("/get-feed", get_feed_1.default);
app.use("/import-bulk-data", import_bulk_data_1.default);
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
//# sourceMappingURL=index.js.map