"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_1 = __importDefault(require("../../../config/firebase"));
async function updateOneTable(containerID, event) {
    if (event?.statusNm.includes("Departure from Port of Loading") &&
        event?.actTpCd === "A") {
        await firebase_1.default
            .firestore()
            .collection("containers")
            .doc(containerID)
            .update({
            "template.SHIP DATE": new Date(event?.eventDt).toLocaleDateString(),
        });
        return;
    }
    if (event?.statusNm.includes("Loaded on") &&
        event?.statusNm.includes("at Port of Loading") &&
        event?.actTpCd === "A") {
        await firebase_1.default.firestore().collection("containers").doc(containerID).update({
            "template.PORT OF LOADING": event?.placeNm,
        });
        return;
    }
    if (event?.statusNm.includes("Arrival at Port of Discharging")) {
        await firebase_1.default
            .firestore()
            .collection("containers")
            .doc(containerID)
            .update({
            "template.PORT OF ARRIVAL": event?.placeNm,
            "template.EST ARRIVAL": new Date(event?.eventDt).toLocaleDateString(),
        });
        return;
    }
    if (event?.statusNm.includes("Gate Out from Inbound Terminal") &&
        event?.actTpCd === "A") {
        await firebase_1.default
            .firestore()
            .collection("containers")
            .doc(containerID)
            .update({
            "template.OUTGATED FROM TERMINAL": new Date(event?.eventDt).toLocaleDateString(),
        });
        return;
    }
    if (event?.statusNm.includes("Empty Container Returned from Customer") &&
        event?.actTpCd === "A") {
        await firebase_1.default
            .firestore()
            .collection("containers")
            .doc(containerID)
            .update({
            "template.RETURNED TO TERMINAL": new Date(event?.eventDt).toLocaleDateString(),
        });
        return;
    }
}
exports.default = updateOneTable;
//# sourceMappingURL=update-one-table.js.map