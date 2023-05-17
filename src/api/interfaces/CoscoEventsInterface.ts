export default interface Events {
  uuid: string;
  containerNumber: string;
  containerNumberStatus: string;
  location: string;
  timeOfIssue: string;
  transportation: string;
  polEtd: string | null;
  polAtd: string | null;
  podEta: string | null;
  podAta: string | null;
  transportId: string | null;
  pol: string | null;
  pod: string | null;
}
