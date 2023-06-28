"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_1 = __importDefault(require("../../../config/firebase"));
const checkDate_1 = __importDefault(require("../checkDate"));
const format_date_1 = __importDefault(require("../format-date"));
async function updateMaerskTable(containerID, event) {
    switch (event.eventClassifierCode) {
        case "EST":
            if (event.transportEventTypeCode === "ARRI") {
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
                            "template.EST ARRIVAL": (0, format_date_1.default)(event?.eventDateTime),
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
                        "template.EST ARRIVAL": (0, format_date_1.default)(event?.eventDateTime),
                    });
                    return;
                }
            }
            break;
        // actual events
        default:
            if (event?.transportEventTypeCode === "DEPA") {
                await firebase_1.default
                    .firestore()
                    .collection("containers")
                    .doc(containerID)
                    .update({
                    "template.SHIP DATE": (0, format_date_1.default)(event?.eventDateTime),
                });
                return;
            }
            if (event?.transportEventTypeCode === "ARRI") {
                let existingDoc = await firebase_1.default
                    .firestore()
                    .collection("containers")
                    .doc(containerID)
                    .get();
                if (existingDoc.exists &&
                    (0, checkDate_1.default)(existingDoc.data().template["EST ARRIVAL"])) {
                    let localDateString = existingDoc.data().template["EST ARRIVAL"];
                    const localDate = new Date(localDateString); // Convert the localized date string to a date object
                    const localDateTimeString = localDate.toISOString().slice(0, 19) + "Z"; // Convert the date object to a date-time string in the same format as dateTimeString
                    if (localDateTimeString > event?.eventDateTime) {
                        return;
                    }
                    else {
                        await firebase_1.default
                            .firestore()
                            .collection("containers")
                            .doc(containerID)
                            .update({
                            "template.EST ARRIVAL": (0, format_date_1.default)(event?.eventDateTime),
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
                        "template.EST ARRIVAL": (0, format_date_1.default)(event?.eventDateTime),
                    });
                    return;
                }
            }
            if (event?.equipmentEventTypeCode === "LOAD") {
                await firebase_1.default
                    .firestore()
                    .collection("containers")
                    .doc(containerID)
                    .update({
                    "template.PORT OF LOADING": event?.transportCall?.otherFacility,
                });
                return;
            }
            if (event?.equipmentEventTypeCode === "DISC") {
                await firebase_1.default
                    .firestore()
                    .collection("containers")
                    .doc(containerID)
                    .update({
                    "template.PORT OF ARRIVAL": event?.transportCall?.otherFacility,
                });
                return;
            }
            if (event?.eventType === "EQUIPMENT" &&
                event?.equipmentEventTypeCode == "GTOT") {
                await firebase_1.default
                    .firestore()
                    .collection("containers")
                    .doc(containerID)
                    .update({
                    "template.OUTGATED FROM TERMINAL": (0, format_date_1.default)(event?.eventDateTime),
                });
                return;
            }
            if (event?.eventType === "EQUIPMENT" &&
                event?.equipmentEventTypeCode == "DROP") {
                await firebase_1.default
                    .firestore()
                    .collection("containers")
                    .doc(containerID)
                    .update({
                    "template.RETURNED TO TERMINAL": (0, format_date_1.default)(event?.eventDateTime),
                });
                return;
            }
            if (event?.eventType === "EQUIPMENT" &&
                event?.emptyIndicatorCode == "EMPTY" &&
                event?.equipmentEventTypeCode == "GTIN") {
                await firebase_1.default
                    .firestore()
                    .collection("containers")
                    .doc(containerID)
                    .update({
                    "template.RETURNED TO TERMINAL": (0, format_date_1.default)(event?.eventDateTime),
                });
                return;
            }
            break;
    }
}
exports.default = updateMaerskTable;
//# sourceMappingURL=update-maersk-table.js.map