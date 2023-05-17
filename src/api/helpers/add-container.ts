import getMSCEvents from "../carriers/msc-events";
import getZimEvents from "../carriers/zim-events";
import getMaerskEvents from "../carriers/maersk-events";
import getOneEvents from "../carriers/one-events";
import getCoscoEvents from "../carriers/cosco-events";
import updateMSCTable from "./update-table/update-msc-table";
import updateMaerskTable from "./update-table/update-maersk-table";
import updateZimTable from "./update-table/update-zim-table";
import updateOneTable from "./update-table/update-one-table";
import addMscEvent from "./add-event-docs/add-msc-event";
import addMaerskEvent from "./add-event-docs/add-maersk-event";
import addZimEvent from "./add-event-docs/add-zim-event";
import addOneEvent from "./add-event-docs/add-one-event";

export default async function addContainer(
  shippingLine: string,
  containerID: string,
  newContainer: boolean
) {
  switch (shippingLine) {
    case "MSC":
      let msc_events = await getMSCEvents(containerID);
      for (let event of msc_events) {
        await updateMSCTable(containerID, event);
        if (newContainer) {
          addMscEvent(event, containerID);
        }
      }
      break;
    case "MAERSK":
      let maersk_events = await getMaerskEvents(containerID);
      for (let event of maersk_events) {
        await updateMaerskTable(containerID, event);
        if (newContainer) {
          addMaerskEvent(event, containerID);
        }
      }
      break;
    case "ZIM":
      let zim_events = await getZimEvents(containerID);
      for (let event of zim_events) {
        await updateZimTable(containerID, event);
        if (newContainer) {
          addZimEvent(event, containerID);
        }
      }
      break;
    case "ONE":
      let one_events = await getOneEvents(containerID);
      for (let event of one_events) {
        await updateOneTable(containerID, event);
        if (newContainer) {
          addOneEvent(event, containerID);
        }
      }
      break;
    case "COSCO":
      // let cosco_events = await getCoscoEvents(containerID);

      break;
    default:
      break;
  }
}
