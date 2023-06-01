"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_1 = __importDefault(require("../../../config/firebase"));
async function addCoscoEvent(event, containerID) {
    await firebase_1.default
        .firestore()
        .collection("containers")
        .doc(containerID)
        .collection("events")
        .add({
        event: {
            description: event?.containerNumberStatus
                ? event?.containerNumberStatus
                : "NULL",
            eventDateTime: event?.timeOfIssue ? event?.timeOfIssue : "NULL",
            eventClassifierCode: "ACT",
        },
    });
    //
    let containerDoc = await firebase_1.default
        .firestore()
        .collection("containers")
        .doc(containerID)
        .get();
    if (containerDoc.exists) {
        await firebase_1.default
            .firestore()
            .collection("feed")
            .add({
            description: event?.containerNumberStatus
                ? event?.containerNumberStatus
                : "NULL",
            eventDateTime: event?.timeOfIssue ? event?.timeOfIssue : "NULL",
            containerID: containerID,
            company: containerDoc.data()?.company,
            eventType: "Actual",
            shippingLine: containerDoc.data()?.shippingLine,
        });
    }
}
exports.default = addCoscoEvent;
//# sourceMappingURL=add-cosco-event.js.map