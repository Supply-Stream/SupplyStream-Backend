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

  let containerDoc = await admin
    .firestore()
    .collection("containers")
    .doc(containerID)
    .get();
  if (containerDoc.exists) {
    let eventDescription: string;

    switch (event.eventType) {
      case "SHIPMENT":
        eventDescription = event.shipmentEventTypeCode;
        break;
      case "TRANSPORT":
        eventDescription = event.transportEventTypeCode;
        break;
      case "EQUIPMENT":
        eventDescription = event.equipmentEventTypeCode;
        break;
      default:
        eventDescription = event.eventType;
        break;
    }
    await admin
      .firestore()
      .collection("feed")
      .add({
        description: eventDescription,
        eventDateTime: event.eventDateTime,
        containerID: containerID,
        company: containerDoc.data()?.company,
        eventType: event.eventClassifierCode === "ACT" ? "Actual" : "Estimated",
        shippingLine: containerDoc.data()?.shippingLine,
      });
  }
}
