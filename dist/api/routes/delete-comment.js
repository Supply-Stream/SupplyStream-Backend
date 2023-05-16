"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const firebase_1 = __importDefault(require("../../config/firebase"));
const axiom_1 = require("../../config/axiom");
const router = express_1.default.Router();
router.delete("/", async (req, res) => {
    let { column, container } = req.body;
    if (!column || !container || column == "" || container == "") {
        res.status(400).send({
            error: "missing parts or all of request body",
        });
        return;
    }
    try {
        let commentQuery = await firebase_1.default
            .firestore()
            .collection("containers")
            .doc(container)
            .collection("comments")
            .where("column", "==", column)
            .where("container", "==", container)
            .get();
        let commentDocs = commentQuery.docs;
        if (commentDocs.length == 0) {
            res.status(400).send({
                error: "no comments found",
            });
            return;
        }
        else {
            for (let doc of commentDocs) {
                await firebase_1.default
                    .firestore()
                    .collection("containers")
                    .doc(container)
                    .collection("comments")
                    .doc(doc.id)
                    .delete();
                await firebase_1.default
                    .firestore()
                    .collection("containers")
                    .doc(container)
                    .update({
                    hasComments: firebase_1.default.firestore.FieldValue.increment(-1),
                });
            }
            res.status(200).send({
                success: "comments deleted",
            });
            return;
        }
    }
    catch (error) {
        await axiom_1.client.ingestEvents("supplystream-errors", [
            { error: error, originEndpoint: "delete-comment" },
        ]);
        res.sendStatus(400).send({
            error: "error deleting comments",
        });
    }
});
exports.default = router;
//# sourceMappingURL=delete-comment.js.map