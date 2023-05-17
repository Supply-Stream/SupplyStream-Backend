import axios from "axios";
import { config } from "dotenv";
import { client } from "../../config/axiom";
import OneEventsInterface from "../interfaces/OneEventsInterface";
import qs from "qs";
config();

export default async function getOneEvents(
  containerID: string
): Promise<OneEventsInterface[]> {
  let data = qs.stringify({
    f_cmd: "122",
    cntr_no: containerID,
    cust_cd: "",
    search_type: "C",
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://ecomm.one-line.com/ecom/CUP_HOM_3301GS.do",
    headers: {
      authority: "ecomm.one-line.com",
      accept: "application/json, text/javascript, */*; q=0.01",
      "accept-language": "en-US,en;q=0.9,es;q=0.8,fr;q=0.7",
      "content-type": "application/x-www-form-urlencoded",
      cookie:
        '_hjSessionUser_3357074=eyJpZCI6ImU5MjgzMzAxLTljM2YtNTRhZC1hZTYwLTU1ZGE5NTUzN2Q2NiIsImNyZWF0ZWQiOjE2Nzc2OTY2NDExMTIsImV4aXN0aW5nIjp0cnVlfQ==; sessLocale=en; _ga=GA1.1.1036173117.1684101645; __utmz=80864515.1684101647.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); AKA_A2=A; gnossJSESSIONID=AacfrFmhEzL71bw4PSQyZSxHB_hmvBBrl0o2UE5YSWk534c7Dzo1!421853375!-483542921; __utma=80864515.1036173117.1684101645.1684101647.1684158570.2; __utmc=80864515; __utmt_UA-102412868-32=1; __utmt_UA-158851397-1=1; usrCntCd=US; SF8frFiF_uigBUMvexL-_yXy_sQPpIt9qFS8HY7inK8Ug-7ILL-e!-430449722!1450095752!1684158568582=%7B%22redirectUrl%22%3A%22CUP_HOM_3301.do%22%7D; _ga_K4HP4NWWNF=GS1.1.1684158568.2.1.1684158725.0.0.0; RT="z=1&dm=one-line.com&si=hfbxn18xqxs&ss=lhnymxjj&sl=0&tt=0"; __utmb=80864515.4.10.1684158570; AacfrFmhEzL71bw4PSQyZSxHB_hmvBBrl0o2UE5YSWk534c7Dzo1!421853375!-483542921!1684158568865=%7B%22redirectUrl%22%3A%22CUP_HOM_3301.do%22%7D; _dd_s=rum=0&expire=1684159663913; gnossJSESSIONID=YpMfrSzSFDUiDhyQhxW2GeISmNNWD9R-eGrbqLWsr5-exQh-W3Ba!-430449722!1450095752',
      origin: "https://ecomm.one-line.com",
      referer: "https://ecomm.one-line.com/ecom/CUP_HOM_3301.do",
      "sec-ch-ua":
        '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
      "x-requested-with": "XMLHttpRequest",
    },
    data: data,
  };
  try {
    let oneLineResp = await axios.request(config);
    let cop_no = oneLineResp.data.list[0].copNo;

    // Get the events
    let data2 = qs.stringify({
      f_cmd: "125",
      cop_no: cop_no,
    });

    let config2 = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://ecomm.one-line.com/ecom/CUP_HOM_3301GS.do",
      headers: {
        authority: "ecomm.one-line.com",
        accept: "application/json, text/javascript, */*; q=0.01",
        "accept-language": "en-US,en;q=0.9,es;q=0.8,fr;q=0.7",
        "content-type": "application/x-www-form-urlencoded",
        cookie:
          '_hjSessionUser_3357074=eyJpZCI6ImU5MjgzMzAxLTljM2YtNTRhZC1hZTYwLTU1ZGE5NTUzN2Q2NiIsImNyZWF0ZWQiOjE2Nzc2OTY2NDExMTIsImV4aXN0aW5nIjp0cnVlfQ==; sessLocale=en; _ga=GA1.1.1036173117.1684101645; __utmz=80864515.1684101647.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); AKA_A2=A; gnossJSESSIONID=AacfrFmhEzL71bw4PSQyZSxHB_hmvBBrl0o2UE5YSWk534c7Dzo1!421853375!-483542921; __utma=80864515.1036173117.1684101645.1684101647.1684158570.2; __utmc=80864515; __utmt_UA-102412868-32=1; __utmt_UA-158851397-1=1; usrCntCd=US; SF8frFiF_uigBUMvexL-_yXy_sQPpIt9qFS8HY7inK8Ug-7ILL-e!-430449722!1450095752!1684158568582=%7B%22redirectUrl%22%3A%22CUP_HOM_3301.do%22%7D; _ga_K4HP4NWWNF=GS1.1.1684158568.2.1.1684158725.0.0.0; RT="z=1&dm=one-line.com&si=hfbxn18xqxs&ss=lhnymxjj&sl=0&tt=0"; __utmb=80864515.4.10.1684158570; AacfrFmhEzL71bw4PSQyZSxHB_hmvBBrl0o2UE5YSWk534c7Dzo1!421853375!-483542921!1684158568865=%7B%22redirectUrl%22%3A%22CUP_HOM_3301.do%22%7D; _dd_s=rum=0&expire=1684159664919; gnossJSESSIONID=YpMfrSzSFDUiDhyQhxW2GeISmNNWD9R-eGrbqLWsr5-exQh-W3Ba!-430449722!1450095752',
        origin: "https://ecomm.one-line.com",
        referer: "https://ecomm.one-line.com/ecom/CUP_HOM_3301.do",
        "sec-ch-ua":
          '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
        "x-requested-with": "XMLHttpRequest",
      },
      data: data2,
    };

    let oneEvents = await axios.request(config2);
    return oneEvents.data.list;
  } catch (error) {
    await client.ingestEvents("supplystream-errors", [
      { error: error, originEndpoint: "one-events" },
    ]);
    return error;
  }
}
