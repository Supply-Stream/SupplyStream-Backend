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
}
exports.default = addMscEvent;
//# sourceMappingURL=add-msc-event.js.map