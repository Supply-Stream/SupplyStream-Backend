import OneEventsInterface from "../../interfaces/OneEventsInterface";
import admin from "../../../config/firebase";
import formatDate from "../format-date";

export default async function updateOneTable(
  containerID: string,
  event: OneEventsInterface
) {
  if (
    event?.statusNm.includes("Departure from Port of Loading") &&
    event?.actTpCd === "A"
  ) {
    await admin
      .firestore()
      .collection("containers")
      .doc(containerID)
      .update({
        "template.SHIP DATE": formatDate(event?.eventDt),
      });
    return;
  }
  if (
    event?.statusNm.includes("Loaded on") &&
    event?.statusNm.includes("at Port of Loading") &&
    event?.actTpCd === "A"
  ) {
    await admin.firestore().collection("containers").doc(containerID).update({
      "template.PORT OF LOADING": event?.placeNm,
    });
    return;
  }

  if (event?.statusNm.includes("Arrival at Port of Discharging")) {
    await admin
      .firestore()
      .collection("containers")
      .doc(containerID)
      .update({
        "template.PORT OF ARRIVAL": event?.placeNm,
        "template.EST ARRIVAL": formatDate(event?.eventDt),
      });
    return;
  }

  if (
    event?.statusNm.includes("Gate Out from Inbound Terminal") &&
    event?.actTpCd === "A"
  ) {
    await admin
      .firestore()
      .collection("containers")
      .doc(containerID)
      .update({
        "template.OUTGATED FROM TERMINAL": formatDate(event?.eventDt),
      });
    return;
  }
  if (
    event?.statusNm.includes("Empty Container Returned from Customer") &&
    event?.actTpCd === "A"
  ) {
    await admin
      .firestore()
      .collection("containers")
      .doc(containerID)
      .update({
        "template.RETURNED TO TERMINAL": formatDate(event?.eventDt),
      });
    return;
  }
}
