"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_1 = __importDefault(require("../../../config/firebase"));
async function addMaerskEvent(event, containerID) {
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
        let eventDescription;
        switch (event.eventType) {
            case "SHIPMENT":
                eventDescription = event.shipmentEventTypeCode;
                break;
            case "TRANSPORT":
                eventDescription = event.transportEventTypeCode;
                break;
            case "EQUIPMENT":
                eventDescription = event.equipmentEventTypeCode;
                break;
            default:
                eventDescription = event.eventType;
                break;
        }
        await firebase_1.default
            .firestore()
            .collection("feed")
            .add({
            description: eventDescription,
            eventDateTime: event.eventDateTime,
            containerID: containerID,
            company: containerDoc.data()?.company,
            eventType: event.eventClassifierCode === "ACT" ? "Actual" : "Estimated",
            shippingLine: containerDoc.data()?.shippingLine,
        });
    }
}
exports.default = addMaerskEvent;
//# sourceMappingURL=add-maersk-event.js.map