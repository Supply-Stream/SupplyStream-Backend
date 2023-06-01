"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_1 = __importDefault(require("../../../config/firebase"));
async function addMscEvent(event, containerID) {
    await firebase_1.default
        .firestore()
        .collection("containers")
        .doc(containerID)
        .collection("events")
        .add({
        event: event,
    });
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
            description: event.description,
            eventDateTime: event.eventDateTime,
            containerID: containerID,
            company: containerDoc.data()?.company,
            eventType: event?.eventClassifierCode === "ACT" ? "Actual" : "Estimated",
            shippingLine: containerDoc.data()?.shippingLine,
        });
    }
}
exports.default = addMscEvent;
//# sourceMappingURL=add-msc-event.js.map