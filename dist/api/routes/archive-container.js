"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const firebase_1 = __importDefault(require("../../config/firebase"));
const axiom_1 = require("../../config/axiom");
const router = express_1.default.Router();
router.post("/", async (req, res) => {
    const containerID = req.body.containerID;
    if (!containerID) {
        res.status(400).send({ error: "missing containerID" });
    }
    try {
        // create document and subcollection refs
        let docRef = await firebase_1.default
            .firestore()
            .collection("containers")
            .doc(containerID);
        let subCollectionRef = await docRef.collection("events");
        let commentsRef = await docRef.collection("comments");
        // get the document and subcollections
        let doc = await docRef.get();
        let subCollection = await subCollectionRef.get();
        let commentCollection = await commentsRef.get();
        // create a new document in the archive collection
        await firebase_1.default
            .firestore()
            .collection("archives")
            .doc(containerID)
            .set(doc.data());
        // create a new subcollection in the archive collection
        if (!subCollection.empty) {
            for (let eventDoc of subCollection.docs) {
                await firebase_1.default
                    .firestore()
                    .collection("archives")
                    .doc(containerID)
                    .collection("events")
                    .add(eventDoc.data());
                // delete the subcollection document
                await eventDoc.ref.delete();
            }
        }
        if (!commentCollection.empty) {
            for (let commentDoc of commentCollection.docs) {
                await firebase_1.default
                    .firestore()
                    .collection("archives")
                    .doc(containerID)
                    .collection("comments")
                    .add(commentDoc.data());
                // delete the subcollection document
                await commentDoc.ref.delete();
            }
        }
        // delete the document
        await docRef.delete();
        res.sendStatus(200);
    }
    catch (error) {
        await axiom_1.client.ingestEvents("supplystream-errors", [
            { error: error, originEndpoint: "add-multiple-containers" },
        ]);
    }
});
exports.default = router;
//# sourceMappingURL=archive-container.js.map