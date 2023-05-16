import { Client } from "@axiomhq/axiom-node";
import { config } from "dotenv";
config();

export const client = new Client({
  token: process.env.AXIOM_TOKEN,
  orgId: process.env.AXIOM_ORG_ID,
});
