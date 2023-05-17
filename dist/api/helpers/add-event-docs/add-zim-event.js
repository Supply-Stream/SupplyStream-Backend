"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_1 = __importDefault(require("../../../config/firebase"));
async function addZimEvent(event, containerID) {
    await firebase_1.default
        .firestore()
        .collection("containers")
        .doc(containerID)
        .collection("events")
        .add({
        event: {
            description: event?.eventName ? event.eventName : "NULL",
            eventDateTime: event?.activityDateTz ? event.activityDateTz : "NULL",
            eventClassifierCode: "ACT",
        },
    });
}
exports.default = addZimEvent;
//# sourceMappingURL=add-zim-event.js.map