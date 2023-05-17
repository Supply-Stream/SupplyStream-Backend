"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const firebase_1 = __importDefault(require("../../config/firebase"));
const add_container_1 = __importDefault(require("../helpers/add-container"));
const router = express_1.default.Router();
router.get("/", async (req, res) => {
    const oldContainerID = req.query.oldContainerID;
    const newContainerID = req.query.newContainerID;
    const shippingLine = req.query.shippingLine;
    if (!newContainerID || !newContainerID || !shippingLine) {
        res.status(400).send({ error: "missing containerID or newContainerID" });
        return;
    }
    let checkIfContainerExists = await firebase_1.default
        .firestore()
        .collection("containers")
        .doc(newContainerID)
        .get();
    if (checkIfContainerExists.exists) {
        res.status(409).send({ error: "container already exists" });
        return;
    }
    let OG_CONTAINER = await firebase_1.default
        .firestore()
        .collection("containers")
        .doc(oldContainerID)
        .get();
    let OG_CONTAINER_DATA = OG_CONTAINER.data();
    OG_CONTAINER_DATA["template"]["CONTAINER"] = newContainerID;
    OG_CONTAINER_DATA["template"]["SHIPPING LINE"] = shippingLine;
    OG_CONTAINER["shippingLine"] = shippingLine;
    OG_CONTAINER["dateAdded"] = new Date();
    await firebase_1.default
        .firestore()
        .collection("containers")
        .doc(newContainerID)
        .set(OG_CONTAINER_DATA);
    await (0, add_container_1.default)(shippingLine, newContainerID, true);
});
exports.default = router;
//# sourceMappingURL=duplicate-container.js.map