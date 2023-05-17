import admin from "../config/firebase";
import addContainer from "../api/helpers/add-container";
import { client } from "../config/axiom";
export default async function updateAllContainers() {
  let allContainers = await admin.firestore().collection("containers").get();

  // no container documents
  if (allContainers.empty) {
    return;
  }

  let allContainerDocs = allContainers.docs;

  for (let doc of allContainerDocs) {
    let containerID: string = doc.id;
    let shippingLine: string = doc.data().shippingLine;

    let containerEventDocs = await admin
      .firestore()
      .collection("containers")
      .doc(containerID)
      .collection("events")
      .get();

    let containerEvents = containerEventDocs.docs;

    await addContainer(shippingLine, containerID, false, containerEvents);
  }
  await client.ingestEvents("supplystream-cron", {
    type: "success",
    timestamp: new Date(),
  });
}
