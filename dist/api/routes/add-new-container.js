"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const firebase_1 = __importDefault(require("../../config/firebase"));
const axiom_1 = require("../../config/axiom");
const add_container_1 = __importDefault(require("../helpers/add-container"));
const router = express_1.default.Router();
router.post("/", async (req, res) => {
    const { containerID, shippingLine, members, company } = req.body;
    if (!containerID || !shippingLine || !members || !company) {
        res
            .status(400)
            .send({ error: "missing containerID || shippingLine || members" });
        return;
    }
    let templateDocResp = await firebase_1.default
        .firestore()
        .collection("templates")
        .where("company", "==", company)
        .get();
    let containerTemplate = {};
    templateDocResp.docs[0].data()?.template?.forEach((item) => {
        switch (item?.Header) {
            case "CONTAINER":
                containerTemplate[item?.Header] = containerID;
                break;
            case "SHIPPING LINE":
                containerTemplate[item?.Header] = shippingLine;
                break;
            case "AUTOMATED":
                if (shippingLine == "MSC" ||
                    shippingLine == "MAERSK" ||
                    shippingLine == "ZIM" ||
                    shippingLine == "ONE" ||
                    shippingLine === "COSCO") {
                    containerTemplate[item?.Header] = "true";
                }
                else {
                    containerTemplate[item?.Header] = "false";
                }
                break;
            default:
                containerTemplate[item?.Header] = "N/A";
                break;
        }
    });
    const containerObject = {
        template: {
            ...containerTemplate,
        },
        members: members,
        company: company,
        shippingLine: shippingLine,
        dateAdded: new Date(),
    };
    let containerDocExists = await firebase_1.default
        .firestore()
        .collection("containers")
        .doc(containerID)
        .get();
    if (containerDocExists.exists) {
        res.status(409).send({ error: "container already exists" });
        return;
    }
    await firebase_1.default
        .firestore()
        .collection("containers")
        .doc(containerID)
        .set(containerObject);
    try {
        await (0, add_container_1.default)(shippingLine, containerID, true);
        res.sendStatus(200);
    }
    catch (error) {
        await axiom_1.client.ingestEvents("supplystream-errors", [
            { error: error, originEndpoint: "add-new-container" },
        ]);
        res.status(400).send({ error: error });
    }
});
exports.default = router;
//# sourceMappingURL=add-new-container.js.map