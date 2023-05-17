import getMSCEvents from "../carriers/msc-events";
import getZimEvents from "../carriers/zim-events";
import getMaerskEvents from "../carriers/maersk-events";
import getOneEvents from "../carriers/one-events";
import getCoscoEvents from "../carriers/cosco-events";
import updateMSCTable from "./update-table/update-msc-table";
import updateMaerskTable from "./update-table/update-maersk-table";
import updateZimTable from "./update-table/update-zim-table";
import updateOneTable from "./update-table/update-one-table";

export default async function addContainer(
  shippingLine: string,
  containerID: string
) {
  switch (shippingLine) {
    case "MSC":
      let msc_events = await getMSCEvents(containerID);
      for (let event of msc_events) {
        await updateMSCTable(containerID, event);
      }
      break;
    case "MAERSK":
      let maersk_events = await getMaerskEvents(containerID);
      for (let event of maersk_events) {
        await updateMaerskTable(containerID, event);
      }
      break;
    case "ZIM":
      let zim_events = await getZimEvents(containerID);
      for (let event of zim_events) {
        await updateZimTable(containerID, event);
      }
      break;
    case "ONE":
      let one_events = await getOneEvents(containerID);
      for (let event of one_events) {
        await updateOneTable(containerID, event);
      }
      break;
    case "COSCO":
      // let cosco_events = await getCoscoEvents(containerID);

      break;
    default:
      break;
  }
}
