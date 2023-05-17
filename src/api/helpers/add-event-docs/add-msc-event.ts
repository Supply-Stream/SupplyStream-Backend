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
}
