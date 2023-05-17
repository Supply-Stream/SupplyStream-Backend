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
    const { containerIDs, shippingLine, company, bol } = req.body;
    if (!containerIDs || !shippingLine || !company || !bol) {
        res
            .status(400)
            .send({ error: "missing containers || shippingLine || company" });
        return;
    }
    let parsedContainerIDs = JSON.parse(containerIDs);
    let templateDocResp = await firebase_1.default
        .firestore()
        .collection("templates")
        .where("company", "==", company)
        .get();
    for (let containerID of parsedContainerIDs) {
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
                        shippingLine == "COSCO") {
                        containerTemplate[item?.Header] = "true";
                    }
                    else {
                        containerTemplate[item?.Header] = "false";
                    }
                    break;
                case "MBL #":
                    containerTemplate[item?.Header] = bol;
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
            members: [],
            company: company,
            shippingLine: shippingLine,
            dateAdded: new Date(),
        };
        let doc = await firebase_1.default
            .firestore()
            .collection("containers")
            .doc(containerID)
            .get();
        if (doc.exists) {
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
        }
        catch (error) {
            await axiom_1.client.ingestEvents("supplystream-errors", [
                { error: error, originEndpoint: "add-multiple-containers" },
            ]);
            res.status(400).send({ error: error });
            return;
        }
    }
    res.sendStatus(200);
});
exports.default = router;
//# sourceMappingURL=add-multiple-containers.js.map