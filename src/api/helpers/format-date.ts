import moment from "moment";

export default function formatDate(dateString: string) {
  let date = moment.utc(dateString, "YYYY-MM-DDTHH:mm:ss");
  let formattedDate = date.format("M/D/YYYY");

  return formattedDate;
}
