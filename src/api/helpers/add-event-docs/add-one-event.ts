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
}
