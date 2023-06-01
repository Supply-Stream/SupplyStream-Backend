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

  let containerDoc = await admin
    .firestore()
    .collection("containers")
    .doc(containerID)
    .get();

  if (containerDoc.exists) {
    await admin.firestore().collection("feed").add({
      description: event.eventName,
      eventDateTime: event?.activityDateTz,
      containerID: containerID,
      company: containerDoc.data()?.company,
      eventType: "Actual",
      shippingLine: containerDoc.data()?.shippingLine,
    });
  }
}
