"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
async function getMaerskEvents(containerID) {
    const bodyParams = new URLSearchParams();
    bodyParams.append("grant_type", "client_credentials");
    bodyParams.append("client_id", "VMpHHvAtuz1oaXuOCaEZNaeNCE6tgelF");
    bodyParams.append("client_secret", "3Xae4cMk8QuK6rGf");
    try {
        let response = await axios_1.default.post("https://api.maersk.com/oauth2/access_token", bodyParams);
        let MAERSK_TOKEN = response?.data?.access_token;
        let MAERSK_RESPONSE = await axios_1.default.get(`https://api.maersk.com/track-and-trace-private/events?equipmentReference=${containerID}`, {
            headers: {
                Authorization: `Bearer ${MAERSK_TOKEN}`,
                "Consumer-Key": "VMpHHvAtuz1oaXuOCaEZNaeNCE6tgelF",
            },
        });
        return MAERSK_RESPONSE?.data?.events;
    }
    catch (error) {
        return error;
    }
}
exports.default = getMaerskEvents;
//# sourceMappingURL=maersk-events.js.map