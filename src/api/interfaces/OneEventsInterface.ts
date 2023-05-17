interface HashColumn {
  [key: string]: string | {};
}

export default interface Event {
  maxRows: number;
  models: any[];
  vslCd: string;
  no: string;
  copNo: string;
  eventDt: string;
  vslEngNm: string;
  placeNm: string;
  skdVoyNo: string;
  yardNm: string;
  copDtlSeq: string;
  skdDirCd: string;
  actTpCd: string;
  statusNm: string;
  statusCd: string;
  nodCd: string;
  vvd: string;
  lloydNo: string;
  hashColumns: HashColumn[];
  hashFields: any[];
}
