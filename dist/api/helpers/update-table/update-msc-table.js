"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_1 = __importDefault(require("../../../config/firebase"));
const checkDate_1 = __importDefault(require("../checkDate"));
async function updateMSCTable(containerID, event) {
    switch (event.description) {
        case "Estimated Time of Arrival":
        case "Vessel Arrival":
            let existingContainerDoc = await firebase_1.default
                .firestore()
                .collection("containers")
                .doc(containerID)
                .get();
            if (existingContainerDoc.exists &&
                (0, checkDate_1.default)(existingContainerDoc.data().template["EST ARRIVAL"])) {
                let localDateString = existingContainerDoc.data().template["EST ARRIVAL"];
                // Convert the localized date string to a date object
                const localDate = new Date(localDateString);
                // Convert the date object to a date-time string in the same format as dateTimeString
                const localDateTimeString = localDate.toISOString().slice(0, 19) + "Z";
                if (localDateTimeString > event?.eventDateTime) {
                    return;
                }
                else {
                    await firebase_1.default
                        .firestore()
                        .collection("containers")
                        .doc(containerID)
                        .update({
                        "template.EST ARRIVAL": new Date(event?.eventDateTime).toLocaleDateString(),
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
                    "template.EST ARRIVAL": new Date(event?.eventDateTime).toLocaleDateString(),
                });
            }
            break;
        case "Vessel Departure":
            await firebase_1.default
                .firestore()
                .collection("containers")
                .doc(containerID)
                .update({
                "template.SHIP DATE": new Date(event?.eventDateTime).toLocaleDateString(),
            });
            break;
        case "Export Loaded on Vessel":
            await firebase_1.default.firestore().collection("containers").doc(containerID).update({
                "template.PORT OF LOADING": event?.eventLocation?.locationName,
            });
            break;
        case "Import Discharged from Vessel":
            await firebase_1.default.firestore().collection("containers").doc(containerID).update({
                "template.PORT OF ARRIVAL": event?.eventLocation?.locationName,
            });
            break;
        case "Import to consignee":
            await firebase_1.default
                .firestore()
                .collection("containers")
                .doc(containerID)
                .update({
                "template.OUTGATED FROM TERMINAL": new Date(event?.eventDateTime).toLocaleDateString(),
            });
            break;
        case "Empty received at CY":
            await firebase_1.default
                .firestore()
                .collection("containers")
                .doc(containerID)
                .update({
                "template.RETURNED TO TERMINAL": new Date(event?.eventDateTime).toLocaleDateString(),
            });
            break;
    }
}
exports.default = updateMSCTable;
//# sourceMappingURL=update-msc-table.js.map