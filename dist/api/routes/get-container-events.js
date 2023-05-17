"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const firebase_1 = __importDefault(require("../../config/firebase"));
const router = express_1.default.Router();
router.get("/", async (req, res) => {
    const containerID = req.query.containerID;
    const active = req.query.active;
    let shippingLine;
    // find the shipping line
    let shippingLineResponse = await firebase_1.default
        .firestore()
        .collection(active === "true" ? "containers" : "archives")
        .doc(containerID)
        .get();
    if (shippingLineResponse.exists) {
        shippingLine = shippingLineResponse.data().shippingLine;
    }
    let allContainerEvents = await firebase_1.default
        .firestore()
        .collection(active === "true" ? "containers" : "archives")
        .doc(containerID)
        .collection("events")
        .get();
    let rawEvents = [];
    allContainerEvents.docs.forEach((doc) => {
        rawEvents.push(doc.data());
    });
    res.send({
        events: rawEvents,
        shippingLine: shippingLine,
    });
});
exports.default = router;
//# sourceMappingURL=get-container-events.js.map