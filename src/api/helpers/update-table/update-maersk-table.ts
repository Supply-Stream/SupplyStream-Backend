import MaerskEventsInterface from "../../interfaces/MaerskEventsInterface";
import admin from "../../../config/firebase";
import checkDate from "../checkDate";
import formatDate from "../format-date";

export default async function updateMaerskTable(
  containerID: string,
  event: MaerskEventsInterface
) {
  switch (event.eventClassifierCode) {
    case "EST":
      if (event.transportEventTypeCode === "ARRI") {
        let existingContainerDoc = await admin
          .firestore()
          .collection("containers")
          .doc(containerID)
          .get();

        if (
          existingContainerDoc.exists &&
          checkDate(existingContainerDoc.data().template["EST ARRIVAL"])
        ) {
          let localDateString =
            existingContainerDoc.data().template["EST ARRIVAL"];
          // Convert the localized date string to a date object
          const localDate = new Date(localDateString);
          // Convert the date object to a date-time string in the same format as dateTimeString
          const localDateTimeString =
            localDate.toISOString().slice(0, 19) + "Z";
          if (localDateTimeString > event?.eventDateTime) {
            return;
          } else {
            await admin
              .firestore()
              .collection("containers")
              .doc(containerID)
              .update({
                "template.EST ARRIVAL": formatDate(event?.eventDateTime),
              });
            return;
          }
        } else {
          await admin
            .firestore()
            .collection("containers")
            .doc(containerID)
            .update({
              "template.EST ARRIVAL": formatDate(event?.eventDateTime),
            });
          return;
        }
      }
      break;
    // actual events
    default:
      if (event?.transportEventTypeCode === "DEPA") {
        await admin
          .firestore()
          .collection("containers")
          .doc(containerID)
          .update({
            "template.SHIP DATE": formatDate(event?.eventDateTime),
          });
        return;
      }
      if (event?.transportEventTypeCode === "ARRI") {
        let existingDoc = await admin
          .firestore()
          .collection("containers")
          .doc(containerID)
          .get();
        if (
          existingDoc.exists &&
          checkDate(existingDoc.data().template["EST ARRIVAL"])
        ) {
          let localDateString = existingDoc.data().template["EST ARRIVAL"];
          const localDate = new Date(localDateString); // Convert the localized date string to a date object
          const localDateTimeString =
            localDate.toISOString().slice(0, 19) + "Z"; // Convert the date object to a date-time string in the same format as dateTimeString
          if (localDateTimeString > event?.eventDateTime) {
            return;
          } else {
            await admin
              .firestore()
              .collection("containers")
              .doc(containerID)
              .update({
                "template.EST ARRIVAL": formatDate(event?.eventDateTime),
              });
            return;
          }
        } else {
          await admin
            .firestore()
            .collection("containers")
            .doc(containerID)
            .update({
              "template.EST ARRIVAL": formatDate(event?.eventDateTime),
            });
          return;
        }
      }
      if (event?.equipmentEventTypeCode === "LOAD") {
        await admin
          .firestore()
          .collection("containers")
          .doc(containerID)
          .update({
            "template.PORT OF LOADING": event?.transportCall?.otherFacility,
          });
        return;
      }
      if (event?.equipmentEventTypeCode === "DISC") {
        await admin
          .firestore()
          .collection("containers")
          .doc(containerID)
          .update({
            "template.PORT OF ARRIVAL": event?.transportCall?.otherFacility,
          });
        return;
      }
      if (
        event?.eventType === "EQUIPMENT" &&
        event?.equipmentEventTypeCode == "GTOT"
      ) {
        await admin
          .firestore()
          .collection("containers")
          .doc(containerID)
          .update({
            "template.OUTGATED FROM TERMINAL": formatDate(event?.eventDateTime),
          });
        return;
      }
      if (
        event?.eventType === "EQUIPMENT" &&
        event?.equipmentEventTypeCode == "DROP"
      ) {
        await admin
          .firestore()
          .collection("containers")
          .doc(containerID)
          .update({
            "template.RETURNED TO TERMINAL": formatDate(event?.eventDateTime),
          });
        return;
      }
      break;
  }
}
