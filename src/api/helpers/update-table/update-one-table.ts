import OneEventsInterface from "../../interfaces/OneEventsInterface";
import admin from "../../../config/firebase";
import checkDate from "../checkDate";

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
        "template.SHIP DATE": new Date(event?.eventDt).toLocaleDateString(),
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
        "template.EST ARRIVAL": new Date(event?.eventDt).toLocaleDateString(),
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
        "template.OUTGATED FROM TERMINAL": new Date(
          event?.eventDt
        ).toLocaleDateString(),
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
        "template.RETURNED TO TERMINAL": new Date(
          event?.eventDt
        ).toLocaleDateString(),
      });
    return;
  }
}
