interface DocumentReference {
  documentReferenceType: string;
  documentReferenceValue: string;
}

interface Location {
  locationName: string;
}

interface Vessel {
  vesselIMONumber: string;
  vesselName: string;
  vesselFlag: string;
  vesselCallSignNumber: string;
}

interface TransportCall {
  exportVoyageNumber?: string;
  carrierVoyageNumber?: string;
  transportCallSequenceNumber: number;
  location: Location;
  facilityTypeCode: string;
  otherFacility: string;
  modeOfTransport: string;
  vessel?: Vessel;
  UNLocationCode: string;
  carrierServiceCode?: string;
}

interface Reference {
  referenceType: string;
  referenceValue: string;
}

interface Seal {
  sealNumber: string;
  sealSource: string;
  sealType: string;
}

export default interface Event {
  eventID: string;
  eventType: string;
  eventDateTime: string;
  eventCreatedDateTime: string;
  eventClassifierCode: string;
  transportEventTypeCode?: string;
  shipmentEventTypeCode?: string;
  equipmentEventTypeCode?: string;
  documentReferences?: DocumentReference[];
  documentTypeCode?: string;
  documentID?: string;
  references?: Reference[];
  equipmentReference?: string;
  emptyIndicatorCode?: string;
  transportCall?: TransportCall;
  seals?: Seal[];
  ISOEquipmentCode?: string;
}
