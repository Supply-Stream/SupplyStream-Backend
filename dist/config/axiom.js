"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const axiom_node_1 = require("@axiomhq/axiom-node");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.client = new axiom_node_1.Client({
    token: process.env.AXIOM_TOKEN,
    orgId: process.env.AXIOM_ORG_ID,
});
//# sourceMappingURL=axiom.js.map