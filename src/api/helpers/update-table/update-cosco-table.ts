import CoscoEventsInterface from "../../interfaces/CoscoEventsInterface";
import admin from "../../../config/firebase";
import formatDate from "../format-date";

export default async function updateCoscoTable(
  containerID: string,
  event: CoscoEventsInterface
) {
  switch (event.containerNumberStatus) {
    case "Loaded at First POL":
      if (event.transportation === "Vessel") {
        await admin
          .firestore()
          .collection("containers")
          .doc(containerID)
          .update({
            "template.SHIP DATE": formatDate(event?.timeOfIssue),
          });
        await admin
          .firestore()
          .collection("containers")
          .doc(containerID)
          .update({
            "template.PORT OF LOADING": event?.location,
          });
      }
      break;
    case "Discharged at Last POD":
      if (event.transportation === "Vessel") {
        await admin
          .firestore()
          .collection("containers")
          .doc(containerID)
          .update({
            "template.PORT OF ARRIVAL": event?.location,
          });

        await admin
          .firestore()
          .collection("containers")
          .doc(containerID)
          .update({
            "template.EST ARRIVAL": formatDate(event?.timeOfIssue),
          });
      }
      break;
    case "Gate-out from Final Hub":
      if (event.transportation === "Truck") {
        await admin
          .firestore()
          .collection("containers")
          .doc(containerID)
          .update({
            "template.OUTGATED FROM TERMINAL": formatDate(event?.timeOfIssue),
          });
      }
      break;
    case "Empty Equipment Returned":
      if (event.transportation === "Truck") {
        await admin
          .firestore()
          .collection("containers")
          .doc(containerID)
          .update({
            "template.RETURNED TO TERMINAL": formatDate(event?.timeOfIssue),
          });
      }
      break;
    default:
      return;
  }
}
