import admin from "../../../config/firebase";
import MaerskEventsInterface from "../../interfaces/MaerskEventsInterface";

export default async function addMaerskEvent(
  event: MaerskEventsInterface,
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
