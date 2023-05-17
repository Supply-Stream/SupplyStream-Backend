"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_1 = __importDefault(require("../../../config/firebase"));
const checkDate_1 = __importDefault(require("../checkDate"));
async function updateZimTable(containerID, event) {
    if (event?.eventName.startsWith("Container was loaded")) {
        await firebase_1.default.firestore().collection("containers").doc(containerID).update({
            "template.PORT OF LOADING": event?.port,
        });
        return;
    }
    if (event?.eventName.startsWith("Vessel arrival")) {
        let existingDoc = await firebase_1.default
            .firestore()
            .collection("containers")
            .doc(containerID)
            .get();
        if (existingDoc.exists &&
            (0, checkDate_1.default)(existingDoc.data().template["EST ARRIVAL"])) {
            let localDateString = existingDoc.data().template["EST ARRIVAL"];
            // Convert the localized date string to a date object
            const localDate = new Date(localDateString);
            // Convert the date object to a date-time string in the same format as dateTimeString
            const localDateTimeString = localDate.toISOString().slice(0, 19) + "Z";
            if (localDateTimeString > event?.activityDateTz) {
                return;
            }
            else {
                await firebase_1.default
                    .firestore()
                    .collection("containers")
                    .doc(containerID)
                    .update({
                    "template.EST ARRIVAL": new Date(event?.activityDateTz).toLocaleDateString(),
                });
                return;
            }
        }
        else {
            await firebase_1.default
                .firestore()
                .collection("containers")
                .doc(containerID)
                .update({
                "template.EST ARRIVAL": new Date(event?.activityDateTz).toLocaleDateString(),
            });
            return;
        }
    }
    if (event?.eventName.startsWith("Vessel departure from") &&
        event?.eventName.endsWith("Port of Discharge")) {
        await firebase_1.default
            .firestore()
            .collection("containers")
            .doc(containerID)
            .update({
            "template.SHIP DATE": new Date(event?.activityDateTz).toLocaleDateString(),
        });
        return;
    }
    if (event?.eventName === "Container was discharged at Port of Destination") {
        await firebase_1.default.firestore().collection("containers").doc(containerID).update({
            "template.PORT OF ARRIVAL": event?.port,
        });
        return;
    }
    if (event?.eventName.startsWith("Import truck departure from")) {
        await firebase_1.default
            .firestore()
            .collection("containers")
            .doc(containerID)
            .update({
            "template.OUTGATED FROM TERMINAL": new Date(event?.activityDateTz).toLocaleDateString(),
        });
        return;
    }
    if (event?.eventName.startsWith("Empty container gate in")) {
        await firebase_1.default
            .firestore()
            .collection("containers")
            .doc(containerID)
            .update({
            "template.RETURNED TO TERMINAL": new Date(event?.activityDateTz).toLocaleDateString(),
        });
        return;
    }
}
exports.default = updateZimTable;
//# sourceMappingURL=update-zim-table.js.map