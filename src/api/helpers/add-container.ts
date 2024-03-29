import getMSCEvents from "../carriers/msc-events";
import getZimEvents from "../carriers/zim-events";
import getMaerskEvents from "../carriers/maersk-events";
import getOneEvents from "../carriers/one-events";
import getCoscoEvents from "../carriers/cosco-events";
import updateMSCTable from "./update-table/update-msc-table";
import updateMaerskTable from "./update-table/update-maersk-table";
import updateZimTable from "./update-table/update-zim-table";
import updateOneTable from "./update-table/update-one-table";
import updateCoscoTable from "./update-table/update-cosco-table";
import addMscEvent from "./add-event-docs/add-msc-event";
import addMaerskEvent from "./add-event-docs/add-maersk-event";
import addZimEvent from "./add-event-docs/add-zim-event";
import addOneEvent from "./add-event-docs/add-one-event";
import addCoscoEvent from "./add-event-docs/add-cosco-event";

export default async function addContainer(
  shippingLine: string,
  containerID: string,
  newContainer: boolean,
  existingEvents?: any[]
) {
  switch (shippingLine) {
    case "MSC":
      let msc_events = await getMSCEvents(containerID);
      if (msc_events.length === 0) {
        return;
      }
      for (let event of msc_events) {
        await updateMSCTable(containerID, event);
        if (newContainer) {
          addMscEvent(event, containerID);
        } else {
          // check if event exists
          let eventExists = existingEvents?.find(
            (e) => e.data().event.eventId === event.eventId
          );
          if (!eventExists) {
            addMscEvent(event, containerID);
          }
        }
      }
      break;
    case "MAERSK":
      let maersk_events = await getMaerskEvents(containerID);
      if (maersk_events.length === 0) {
        return;
      }
      for (let event of maersk_events) {
        await updateMaerskTable(containerID, event);
        if (newContainer) {
          addMaerskEvent(event, containerID);
        } else {
          // check if event exists
          let eventExists = existingEvents?.find(
            (e) => e.data().event.eventID === event.eventID
          );
          if (!eventExists) {
            addMaerskEvent(event, containerID);
          }
        }
      }
      break;
    case "ZIM":
      let zim_events = await getZimEvents(containerID);
      if (zim_events.length === 0) {
        return;
      }
      for (let event of zim_events) {
        await updateZimTable(containerID, event);
        if (newContainer) {
          addZimEvent(event, containerID);
        } else {
          // check if event exists
          let eventExists = existingEvents?.find(
            (e) => e.data().event.eventDateTime === event.activityDateTz
          );
          if (!eventExists) {
            addZimEvent(event, containerID);
          }
        }
      }
      break;
    case "ONE":
      let one_events = await getOneEvents(containerID);
      if (one_events.length === 0) {
        return;
      }
      for (let event of one_events) {
        await updateOneTable(containerID, event);
        if (newContainer) {
          addOneEvent(event, containerID);
        } else {
          // check if event exists
          let eventExists = existingEvents?.find(
            (e) => e.data().event.eventDateTime === event.eventDt
          );
          if (!eventExists) {
            addOneEvent(event, containerID);
          }
        }
      }
      break;
    case "COSCO":
      let cosco_events = await getCoscoEvents(containerID);
      if (cosco_events.length === 0) {
        return;
      }
      for (let event of cosco_events) {
        await updateCoscoTable(containerID, event);
        if (newContainer) {
          addCoscoEvent(event, containerID);
        } else {
          // check if event exists
          let eventExists = existingEvents?.find(
            (e) => e.data().event.eventDateTime === event?.timeOfIssue
          );
          if (!eventExists) {
            addCoscoEvent(event, containerID);
          }
        }
      }
      break;
    default:
      break;
  }
}
