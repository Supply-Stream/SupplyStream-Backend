"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = require("dotenv");
const axiom_1 = require("../../config/axiom");
(0, dotenv_1.config)();
async function getZimEvents(containerID) {
    const clientId = process.env.ZIM_CLIENT;
    const clientSecret = process.env.ZIM_SECRET;
    const tokenEndpoint = "https://apigw.zim.com/authorize/v1/";
    try {
        let response = await axios_1.default.post(tokenEndpoint, {
            grant_type: "client_credentials",
            client_id: clientId,
            client_secret: clientSecret,
            scope: "tracing",
        }, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "cache-control": "no-cache",
            },
        });
        let ZIM_TOKEN = response.data.access_token;
        let zimEvents = await axios_1.default.get(`https://apigw.zim.com/tracing/v1/${containerID}`, {
            headers: {
                Authorization: `Bearer ${ZIM_TOKEN}`,
                "cache-control": "no-cache",
                "Ocp-Apim-Subscription-Key": process.env.ZIM_SUBSCRIPTION_KEY,
            },
        });
        return zimEvents.data.bkBlDetails.consContainerList[0].containerEventsList;
    }
    catch (error) {
        console.log(error);
        await axiom_1.client.ingestEvents("supplystream-errors", [
            { error: error, originEndpoint: "zim-events" },
        ]);
        return error;
    }
}
exports.default = getZimEvents;
//# sourceMappingURL=zim-events.js.map