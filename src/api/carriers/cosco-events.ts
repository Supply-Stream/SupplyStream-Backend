import axios from "axios";
import { config } from "dotenv";
import { client } from "../../config/axiom";
import qs from "qs";
import CoscoEventsInterface from "../interfaces/CoscoEventsInterface";
config();

export default async function getCoscoEvents(
  containerID: string
): Promise<CoscoEventsInterface[]> {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `https://elines.coscoshipping.com/ebtracking/public/containers/${containerID}?timestamp=1684243823776`,
    headers: {
      Accept: "*/*",
      "Accept-Language": "en-US,en;q=0.9,es;q=0.8,fr;q=0.7",
      Connection: "keep-alive",
      Cookie:
        "HMF_CI=d4c1941b0e681b8850e602e701839173726b2f6c998a1dc3f97314aeb10a12343c46dcacf0f4862bd1cf92c235520434c35a9d8321c7048540bfe039177e9c4007; COSCON_ACCESS_I18N=en-US; HMY_JC=96c97cf028041074ab3d658b132529637099f57bf245fba2c75ab60f32dcf511cc,; Hm_lvt_3dc23c86163f0d1cd70ef10ea94e0263=1684103480,1684243788; Hm_lpvt_3dc23c86163f0d1cd70ef10ea94e0263=1684243788; HBB_HC=60ffa5a1112f990883ae975d0d87355d4745848975b9c4644e82260ece56712f9552738722d9c61968ca9e210d65621abc",
      Referer: "https://elines.coscoshipping.com/ebusiness/cargotracking",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
      "X-Client-Timestamp": "1684243823777",
      language: "en_US",
      "sec-ch-ua":
        '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      sys: "eb",
    },
  };

  try {
    let coscoEvents = await axios(config);
    let coscoEventList =
      coscoEvents?.data?.data.content.containers[0].containerCircleStatus;
    let sortedEvents = coscoEventList.sort(
      (a: CoscoEventsInterface, b: CoscoEventsInterface) => {
        // parse the dates and compare them
        return (
          new Date(a.timeOfIssue).getTime() - new Date(b.timeOfIssue).getTime()
        );
      }
    );
    return sortedEvents;
  } catch (error) {
    await client.ingestEvents("supplystream-errors", [
      { error: error, originEndpoint: "cosco-events" },
    ]);
    return error;
  }
}
