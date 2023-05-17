import admin from "../../../config/firebase";
import ZimEventsInterface from "../../interfaces/ZimEventsInterface";

export default async function addZimEvent(
  event: ZimEventsInterface,
  containerID: string
) {
  await admin
    .firestore()
    .collection("containers")
    .doc(containerID)
    .collection("events")
    .add({
      event: {
        description: event?.eventName ? event.eventName : "NULL",
        eventDateTime: event?.activityDateTz ? event.activityDateTz : "NULL",
        eventClassifierCode: "ACT",
      },
    });
}
