"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_1 = __importDefault(require("../../../config/firebase"));
async function addOneEvent(event, containerID) {
    delete event.hashColumns;
    if (event?.actTpCd === "A") {
        await firebase_1.default
            .firestore()
            .collection("containers")
            .doc(containerID)
            .collection("events")
            .add({
            event: {
                description: event?.statusNm ? event?.statusNm : "NULL",
                eventDateTime: event?.eventDt ? event?.eventDt : "NULL",
                eventClassifierCode: "ACT",
            },
        });
    }
    else {
        await firebase_1.default
            .firestore()
            .collection("containers")
            .doc(containerID)
            .collection("events")
            .add({
            event: {
                description: event?.statusNm ? event?.statusNm : "NULL",
                eventDateTime: event?.eventDt ? event?.eventDt : "NULL",
                eventClassifierCode: "EST",
            },
        });
    }
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
            description: event?.statusNm ? event?.statusNm : "NULL",
            eventDateTime: event?.eventDt ? event?.eventDt : "NULL",
            containerID: containerID,
            company: containerDoc.data()?.company,
            eventType: event?.actTpCd === "A" ? "Actual" : "Estimated",
            shippingLine: containerDoc.data()?.shippingLine,
        });
    }
}
exports.default = addOneEvent;
//# sourceMappingURL=add-one-event.js.map