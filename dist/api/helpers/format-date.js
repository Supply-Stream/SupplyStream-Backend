"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
function formatDate(dateString) {
    let date = moment_1.default.utc(dateString, "YYYY-MM-DDTHH:mm:ss");
    let formattedDate = date.format("M/D/YYYY");
    return formattedDate;
}
exports.default = formatDate;
//# sourceMappingURL=format-date.js.map