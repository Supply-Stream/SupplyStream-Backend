"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const msc_events_1 = __importDefault(require("../carriers/msc-events"));
const zim_events_1 = __importDefault(require("../carriers/zim-events"));
const maersk_events_1 = __importDefault(require("../carriers/maersk-events"));
const one_events_1 = __importDefault(require("../carriers/one-events"));
const cosco_events_1 = __importDefault(require("../carriers/cosco-events"));
const update_msc_table_1 = __importDefault(require("./update-table/update-msc-table"));
const update_maersk_table_1 = __importDefault(require("./update-table/update-maersk-table"));
const update_zim_table_1 = __importDefault(require("./update-table/update-zim-table"));
const update_one_table_1 = __importDefault(require("./update-table/update-one-table"));
const update_cosco_table_1 = __importDefault(require("./update-table/update-cosco-table"));
const add_msc_event_1 = __importDefault(require("./add-event-docs/add-msc-event"));
const add_maersk_event_1 = __importDefault(require("./add-event-docs/add-maersk-event"));
const add_zim_event_1 = __importDefault(require("./add-event-docs/add-zim-event"));
const add_one_event_1 = __importDefault(require("./add-event-docs/add-one-event"));
const add_cosco_event_1 = __importDefault(require("./add-event-docs/add-cosco-event"));
async function addContainer(shippingLine, containerID, newContainer, existingEvents) {
    switch (shippingLine) {
        case "MSC":
            let msc_events = await (0, msc_events_1.default)(containerID);
            if (msc_events.length === 0) {
                return;
            }
            for (let event of msc_events) {
                await (0, update_msc_table_1.default)(containerID, event);
                if (newContainer) {
                    (0, add_msc_event_1.default)(event, containerID);
                }
                else {
                    // check if event exists
                    let eventExists = existingEvents?.find((e) => e.data().event.eventId === event.eventId);
                    if (!eventExists) {
                        (0, add_msc_event_1.default)(event, containerID);
                    }
                }
            }
            break;
        case "MAERSK":
            let maersk_events = await (0, maersk_events_1.default)(containerID);
            if (maersk_events.length === 0) {
                return;
            }
            for (let event of maersk_events) {
                await (0, update_maersk_table_1.default)(containerID, event);
                if (newContainer) {
                    (0, add_maersk_event_1.default)(event, containerID);
                }
                else {
                    // check if event exists
                    let eventExists = existingEvents?.find((e) => e.data().event.eventID === event.eventID);
                    if (!eventExists) {
                        (0, add_maersk_event_1.default)(event, containerID);
                    }
                }
            }
            break;
        case "ZIM":
            let zim_events = await (0, zim_events_1.default)(containerID);
            if (zim_events.length === 0) {
                return;
            }
            for (let event of zim_events) {
                await (0, update_zim_table_1.default)(containerID, event);
                if (newContainer) {
                    (0, add_zim_event_1.default)(event, containerID);
                }
                else {
                    // check if event exists
                    let eventExists = existingEvents?.find((e) => e.data().event.eventDateTime === event.activityDateTz);
                    if (!eventExists) {
                        (0, add_zim_event_1.default)(event, containerID);
                    }
                }
            }
            break;
        case "ONE":
            let one_events = await (0, one_events_1.default)(containerID);
            if (one_events.length === 0) {
                return;
            }
            for (let event of one_events) {
                await (0, update_one_table_1.default)(containerID, event);
                if (newContainer) {
                    (0, add_one_event_1.default)(event, containerID);
                }
                else {
                    // check if event exists
                    let eventExists = existingEvents?.find((e) => e.data().event.eventDateTime === event.eventDt);
                    if (!eventExists) {
                        (0, add_one_event_1.default)(event, containerID);
                    }
                }
            }
            break;
        case "COSCO":
            let cosco_events = await (0, cosco_events_1.default)(containerID);
            if (cosco_events.length === 0) {
                return;
            }
            for (let event of cosco_events) {
                await (0, update_cosco_table_1.default)(containerID, event);
                if (newContainer) {
                    (0, add_cosco_event_1.default)(event, containerID);
                }
                else {
                    // check if event exists
                    let eventExists = existingEvents?.find((e) => e.data().event.eventDateTime === event?.timeOfIssue);
                    if (!eventExists) {
                        (0, add_cosco_event_1.default)(event, containerID);
                    }
                }
            }
            break;
        default:
            break;
    }
}
exports.default = addContainer;
//# sourceMappingURL=add-container.js.map