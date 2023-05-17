import express, { Request, Response } from "express";
import admin from "../../config/firebase";
import { client } from "../../config/axiom";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  //   let respy = await getMSCEvents("MSDU2774304");
  //   let respy = await getZimEvents("TCNU6836631");
  //   let respy = await getMaerskEvents("TCKU1122133");
  //   let respy = await getOneEvents("BMOU1484792");
  //   let respy = await getCoscoEvents("FTAU1498080");
});

export default router;
