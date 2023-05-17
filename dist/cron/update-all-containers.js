"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_1 = __importDefault(require("../config/firebase"));
const add_container_1 = __importDefault(require("../api/helpers/add-container"));
async function updateAllContainers() {
    let allContainers = await firebase_1.default.firestore().collection("containers").get();
    // no container documents
    if (allContainers.empty) {
        return;
    }
    let allContainerDocs = allContainers.docs;
    for (let doc of allContainerDocs) {
        let containerID = doc.id;
        let shippingLine = doc.data().shippingLine;
        let containerEventDocs = await firebase_1.default
            .firestore()
            .collection("containers")
            .doc(containerID)
            .collection("events")
            .get();
        let containerEvents = containerEventDocs.docs;
        await (0, add_container_1.default)(shippingLine, containerID, false, containerEvents);
    }
}
exports.default = updateAllContainers;
//# sourceMappingURL=update-all-containers.js.map