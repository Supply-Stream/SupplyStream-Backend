"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const one_events_1 = __importDefault(require("../carriers/one-events"));
const router = express_1.default.Router();
router.get("/", async (req, res) => {
    //   let respy = await getMSCEvents("MSDU2774304");
    //   let respy = await getZimEvents("TCNU6836631");
    //   let respy = await getMaerskEvents("TCKU1122133");
    let respy = await (0, one_events_1.default)("BMOU1484792");
});
exports.default = router;
//# sourceMappingURL=duplicate-container.js.map