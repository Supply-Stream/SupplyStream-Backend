import MscEventsInterface from "../../interfaces/MscEventsInterface";
import admin from "../../../config/firebase";
import checkDate from "../checkDate";
import formatDate from "../format-date";

export default async function updateMSCTable(
  containerID: string,
  event: MscEventsInterface
) {
  switch (event.description) {
    case "Estimated Time of Arrival":
    case "Vessel Arrival":
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
        const localDateTimeString = localDate.toISOString().slice(0, 19) + "Z";
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
      }
      break;

    case "Vessel Departure":
      await admin
        .firestore()
        .collection("containers")
        .doc(containerID)
        .update({
          "template.SHIP DATE": formatDate(event?.eventDateTime),
        });
      break;

    case "Export Loaded on Vessel":
      await admin.firestore().collection("containers").doc(containerID).update({
        "template.PORT OF LOADING": event?.eventLocation?.locationName,
      });
      break;

    case "Import Discharged from Vessel":
      await admin.firestore().collection("containers").doc(containerID).update({
        "template.PORT OF ARRIVAL": event?.eventLocation?.locationName,
      });
      break;

    case "Import to consignee":
      await admin
        .firestore()
        .collection("containers")
        .doc(containerID)
        .update({
          "template.OUTGATED FROM TERMINAL": formatDate(event?.eventDateTime),
        });
      break;

    case "Empty received at CY":
      await admin
        .firestore()
        .collection("containers")
        .doc(containerID)
        .update({
          "template.RETURNED TO TERMINAL": formatDate(event?.eventDateTime),
        });
      break;

    case "Empty to Shipper":
      await admin
        .firestore()
        .collection("containers")
        .doc(containerID)
        .update({
          "template.RETURNED TO TERMINAL": formatDate(event?.eventDateTime),
        });
      break;
  }
}
