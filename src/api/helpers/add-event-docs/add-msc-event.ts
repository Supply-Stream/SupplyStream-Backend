import MscEventsInterface from "../../interfaces/MscEventsInterface";
import admin from "../../../config/firebase";

export default async function addMscEvent(
  event: MscEventsInterface,
  containerID: string
) {
  await admin
    .firestore()
    .collection("containers")
    .doc(containerID)
    .collection("events")
    .add({
      event: event,
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
        description: event.description,
        eventDateTime: event.eventDateTime,
        containerID: containerID,
        company: containerDoc.data()?.company,
        eventType:
          event?.eventClassifierCode === "ACT" ? "Actual" : "Estimated",
      });
  }
}
