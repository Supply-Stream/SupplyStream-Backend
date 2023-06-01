import admin from "../../../config/firebase";
import OneEventsInterface from "../../interfaces/OneEventsInterface";

export default async function addOneEvent(
  event: OneEventsInterface,
  containerID: string
) {
  delete event.hashColumns;
  if (event?.actTpCd === "A") {
    await admin
      .firestore()
      .collection("containers")
      .doc(containerID)
      .collection("events")
      .add({
        event: {
          description: event?.statusNm ? event?.statusNm : "NULL",
          eventDateTime: event?.eventDt ? event?.eventDt : "NULL",
          eventClassifierCode: "ACT",
        },
      });
  } else {
    await admin
      .firestore()
      .collection("containers")
      .doc(containerID)
      .collection("events")
      .add({
        event: {
          description: event?.statusNm ? event?.statusNm : "NULL",
          eventDateTime: event?.eventDt ? event?.eventDt : "NULL",
          eventClassifierCode: "EST",
        },
      });
  }

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
        description: event?.statusNm ? event?.statusNm : "NULL",
        eventDateTime: event?.eventDt ? event?.eventDt : "NULL",
        containerID: containerID,
        company: containerDoc.data()?.company,
        eventType: event?.actTpCd === "A" ? "Actual" : "Estimated",
      });
  }
}
