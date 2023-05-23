import ZimEventsInterface from "../../interfaces/ZimEventsInterface";
import admin from "../../../config/firebase";
import checkDate from "../checkDate";
import formatDate from "../format-date";

export default async function updateZimTable(
  containerID: string,
  event: ZimEventsInterface
) {
  if (event?.eventName.startsWith("Container was loaded")) {
    await admin.firestore().collection("containers").doc(containerID).update({
      "template.PORT OF LOADING": event?.port,
    });
    return;
  }

  if (event?.eventName.startsWith("Vessel arrival")) {
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
      // Convert the localized date string to a date object
      const localDate = new Date(localDateString);
      // Convert the date object to a date-time string in the same format as dateTimeString
      const localDateTimeString = localDate.toISOString().slice(0, 19) + "Z";
      if (localDateTimeString > event?.activityDateTz) {
        return;
      } else {
        await admin
          .firestore()
          .collection("containers")
          .doc(containerID)
          .update({
            "template.EST ARRIVAL": formatDate(event?.activityDateTz),
          });
        return;
      }
    } else {
      await admin
        .firestore()
        .collection("containers")
        .doc(containerID)
        .update({
          "template.EST ARRIVAL": formatDate(event?.activityDateTz),
        });
      return;
    }
  }

  if (
    event?.eventName.startsWith("Vessel departure from") &&
    event?.eventName.endsWith("Port of Discharge")
  ) {
    await admin
      .firestore()
      .collection("containers")
      .doc(containerID)
      .update({
        "template.SHIP DATE": formatDate(event?.activityDateTz),
      });
    return;
  }

  if (event?.eventName === "Container was discharged at Port of Destination") {
    await admin.firestore().collection("containers").doc(containerID).update({
      "template.PORT OF ARRIVAL": event?.port,
    });
    return;
  }

  if (event?.eventName.startsWith("Import truck departure from")) {
    await admin
      .firestore()
      .collection("containers")
      .doc(containerID)
      .update({
        "template.OUTGATED FROM TERMINAL": formatDate(event?.activityDateTz),
      });
    return;
  }

  if (event?.eventName.startsWith("Empty container gate in")) {
    await admin
      .firestore()
      .collection("containers")
      .doc(containerID)
      .update({
        "template.RETURNED TO TERMINAL": formatDate(event?.activityDateTz),
      });
    return;
  }
}
