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

  let containerDoc = await admin
    .firestore()
    .collection("containers")
    .doc(containerID)
    .get();
  if (containerDoc.exists) {
    await admin
      .firestore()
      .collection("feed")
      .add({
        description: event?.containerNumberStatus
          ? event?.containerNumberStatus
          : "NULL",
        eventDateTime: event?.timeOfIssue ? event?.timeOfIssue : "NULL",
        containerID: containerID,
        company: containerDoc.data()?.company,
        eventType: "Actual",
        shippingLine: containerDoc.data()?.shippingLine,
      });
  }
}
