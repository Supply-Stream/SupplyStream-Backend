import admin from "../../../config/firebase";
import CoscoEventsInterface from "../../interfaces/CoscoEventsInterface";

export default async function addCoscoEvent(
  event: CoscoEventsInterface,
  containerID: string
) {
  await admin
    .firestore()
    .collection("containers")
    .doc(containerID)
    .collection("events")
    .add({
      event: {
        description: event?.containerNumberStatus
          ? event?.containerNumberStatus
          : "NULL",
        eventDateTime: event?.timeOfIssue ? event?.timeOfIssue : "NULL",
        eventClassifierCode: "ACT",
      },
    });
}
