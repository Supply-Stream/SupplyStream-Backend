import axios from "axios";
import { config } from "dotenv";
import ZimEventsInterface from "../interfaces/ZimEventsInterface";
import { client } from "../../config/axiom";
config();

export default async function getZimEvents(
  containerID: string
): Promise<ZimEventsInterface[]> {
  const clientId = process.env.ZIM_CLIENT;
  const clientSecret = process.env.ZIM_SECRET;
  const tokenEndpoint = "https://apigw.zim.com/authorize/v1/";

  try {
    let response = await axios.post(
      tokenEndpoint,
      {
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
        scope: "tracing",
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "cache-control": "no-cache",
        },
      }
    );

    let ZIM_TOKEN = response.data.access_token;

    let zimEvents = await axios.get(
      `https://apigw.zim.com/tracing/v1/${containerID}`,
      {
        headers: {
          Authorization: `Bearer ${ZIM_TOKEN}`,
          "cache-control": "no-cache",
          "Ocp-Apim-Subscription-Key": process.env.ZIM_SUBSCRIPTION_KEY,
        },
      }
    );

    return zimEvents.data.bkBlDetails.consContainerList[0].containerEventsList;
  } catch (error) {
    console.log(error);
    await client.ingestEvents("supplystream-errors", [
      { error: error, originEndpoint: "zim-events" },
    ]);
    return error;
  }
}
