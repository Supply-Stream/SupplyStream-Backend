export default function checkDate(dateString: string) {
  const date: any = new Date(dateString);
  return !isNaN(date);
}
