import MaerskEventsInterface from "../../interfaces/MaerskEventsInterface";
import CoscoEventsInterface from "../../interfaces/CoscoEventsInterface";
import admin from "../../../config/firebase";
import checkDate from "../checkDate";
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
            "template.SHIP DATE": new Date(
              event?.timeOfIssue
            ).toLocaleDateString(),
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
            "template.EST ARRIVAL": new Date(
              event?.timeOfIssue
            ).toLocaleDateString(),
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
            "template.OUTGATED FROM TERMINAL": new Date(
              event?.timeOfIssue
            ).toLocaleDateString(),
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
            "template.RETURNED TO TERMINAL": new Date(
              event?.timeOfIssue
            ).toLocaleDateString(),
          });
      }
      break;
    default:
      return;
  }
}
