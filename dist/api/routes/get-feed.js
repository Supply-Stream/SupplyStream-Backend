"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const firebase_1 = __importDefault(require("../../config/firebase"));
const router = express_1.default.Router();
router.get("/", async (req, res) => {
    if (!req.query.company) {
        res.send("No company provided");
        return;
    }
    try {
        let query = await firebase_1.default
            .firestore()
            .collection("feed")
            .where("company", "==", req.query.company)
            .get();
        let docData = query.docs.map((doc) => doc.data());
        res.send(docData);
    }
    catch (error) {
        console.log(error);
    }
});
exports.default = router;
//# sourceMappingURL=get-feed.js.map