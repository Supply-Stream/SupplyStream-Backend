"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = require("dotenv");
const axiom_1 = require("../../config/axiom");
const msal = require("@azure/msal-node");
(0, dotenv_1.config)();
async function getMSCEvents(containerID) {
    const thumbprint = "6E:65:D1:C6:17:47:6A:3C:47:7B:03:1F:93:A1:B8:F4:1C:93:BF:7E";
    const formattedThumbprint = thumbprint.toLowerCase().replace(/:/g, "");
    const config = {
        auth: {
            clientId: "67fbf2cc-e36c-46e4-a52c-59da838d18ea",
            authority: "https://login.microsoftonline.com/088e9b00-ffd0-458e-bfa1-acf4c596d3cb",
            clientCertificate: {
                thumbprint: formattedThumbprint,
                privateKey: process.env.MSC_CERT,
            },
        },
    };
    const tokenRequest = {
        scopes: ["d26fb2db-8b02-4bef-8443-65e8ebafcb2f/.default"],
    };
    const cca = new msal.ConfidentialClientApplication(config);
    try {
        const { accessToken } = await cca.acquireTokenByClientCredential(tokenRequest);
        let MSC_RESPONSE = await axios_1.default.get(`https://uat.api.tech.msc.com/msc/trackandtrace/v2.2/events?equipmentReference=${containerID}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        });
        return MSC_RESPONSE.data;
    }
    catch (error) {
        console.log(error);
        await axiom_1.client.ingestEvents("supplystream-errors", [
            { error: error, originEndpoint: "msc-events" },
        ]);
        return error;
    }
}
exports.default = getMSCEvents;
//# sourceMappingURL=msc-events.js.map