"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_1 = __importDefault(require("../../../config/firebase"));
async function updateCoscoTable(containerID, event) {
    switch (event.containerNumberStatus) {
        case "Loaded at First POL":
            if (event.transportation === "Vessel") {
                await firebase_1.default
                    .firestore()
                    .collection("containers")
                    .doc(containerID)
                    .update({
                    "template.SHIP DATE": new Date(event?.timeOfIssue).toLocaleDateString(),
                });
                await firebase_1.default
                    .firestore()
                    .collection("containers")
                    .doc(containerID)
                    .update({
                    "template.PORT OF LOADING": event?.location,
                });
            }
            break;
        case "Discharged at Last POD":
            if (event.transportation === "Vessel") {
                await firebase_1.default
                    .firestore()
                    .collection("containers")
                    .doc(containerID)
                    .update({
                    "template.PORT OF ARRIVAL": event?.location,
                });
                await firebase_1.default
                    .firestore()
                    .collection("containers")
                    .doc(containerID)
                    .update({
                    "template.EST ARRIVAL": new Date(event?.timeOfIssue).toLocaleDateString(),
                });
            }
            break;
        case "Gate-out from Final Hub":
            if (event.transportation === "Truck") {
                await firebase_1.default
                    .firestore()
                    .collection("containers")
                    .doc(containerID)
                    .update({
                    "template.OUTGATED FROM TERMINAL": new Date(event?.timeOfIssue).toLocaleDateString(),
                });
            }
            break;
        case "Empty Equipment Returned":
            if (event.transportation === "Truck") {
                await firebase_1.default
                    .firestore()
                    .collection("containers")
                    .doc(containerID)
                    .update({
                    "template.RETURNED TO TERMINAL": new Date(event?.timeOfIssue).toLocaleDateString(),
                });
            }
            break;
        default:
            return;
    }
}
exports.default = updateCoscoTable;
//# sourceMappingURL=update-cosco-table.js.map