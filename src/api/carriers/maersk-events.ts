import axios from "axios";
import { config } from "dotenv";
import { client } from "../../config/axiom";
import MaerskEventsInterface from "../interfaces/MaerskEventsInterface";
config();

export default async function getMaerskEvents(
  containerID: string
): Promise<MaerskEventsInterface[]> {
  const bodyParams = new URLSearchParams();
  bodyParams.append("grant_type", "client_credentials");
  bodyParams.append("client_id", "VMpHHvAtuz1oaXuOCaEZNaeNCE6tgelF");
  bodyParams.append("client_secret", "3Xae4cMk8QuK6rGf");

  try {
    let response = await axios.post(
      "https://api.maersk.com/oauth2/access_token",
      bodyParams
    );
    let MAERSK_TOKEN = response?.data?.access_token;

    let MAERSK_RESPONSE = await axios.get(
      `https://api.maersk.com/track-and-trace-private/events?equipmentReference=${containerID}`,
      {
        headers: {
          Authorization: `Bearer ${MAERSK_TOKEN}`,
          "Consumer-Key": "VMpHHvAtuz1oaXuOCaEZNaeNCE6tgelF",
        },
      }
    );

    return MAERSK_RESPONSE?.data?.events;
  } catch (error) {
    await client.ingestEvents("supplystream-errors", [
      { error: error, originEndpoint: "maersk-events" },
    ]);
    return error;
  }
}
