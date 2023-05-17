export default interface Event {
  eventName: string;
  activityDateTz: string;
  port: string;
  portCode: string;
  countryPort: string;
  countryCodePort: string;
  vessel: string | null;
  vesselName: string | null;
  voyage: string | null;
  leg: string | null;
}
