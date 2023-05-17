interface TransportCall {
  transportCallID: string;
  carrierServiceCode: string | null;
  exportVoyageNumber: string | null;
  importVoyageNumber: string | null;
  unLocationCode: string;
  facilityCode: string;
  facilityCodeListProvider: string;
  facilityTypeCode: string;
  otherFacility: any;
  modeOfTransport: string;
  vessel: Vessel | null;
}

interface Vessel {
  vesselIMONumber: string;
  vesselName: string;
  vesselFlag: string;
  vesselCallSignNumber: string;
}

interface DocumentReference {
  documentReferenceType: string;
  documentReferenceValue: string;
}

interface EventLocation {
  locationName: string;
  latitude: number | null;
  longitude: number | null;
  unLocationCode: string;
  facilityCode: string;
  facilityCodeListProvider: string;
  address: any;
}

interface Reference {
  referenceType: string;
  referenceValue: string;
}

export default interface Event {
  eventType: string;
  equipmentEventTypeCode?: string;
  shipmentEventTypeCode?: string;
  documentID?: string;
  documentTypeCode?: string;
  reason?: string;
  description: string;
  eventId: string;
  eventDateTime: string;
  eventClassifierCode: string;
  eventCreatedDateTime: string;
  transportCall?: TransportCall | null;
  documentReferences: DocumentReference[];
  eventLocation?: EventLocation;
  references: Reference[];
}
