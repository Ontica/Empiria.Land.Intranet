import { DateString } from "@app/core";


export interface Issuer {
  uid: string;
  name: string;
  officialPosition: string;
  entity: string;
  place: string;
  period: Period;
}

export interface Instrument {
  uid: string;
  type: InstrumentType;
  typeName: string;
  kind: string;
  issueDate: DateString;
  issuer: Issuer;
  summary: string;
  asText: string;
  controlID: string;
  instrumentNo: string;
  binderNo: string;
  folio: string;
  endFolio: string;
  sheetsCount: number;
  media: InstrumentMedia[];
  status: InstrumentStatus;
}

export const EmptyInstrument: Instrument = {
  uid: '',
  type: null,
  typeName: '',
  kind: '',
  issueDate: '',
  issuer: null,
  summary: '',
  asText: '',
  controlID: '',
  instrumentNo: '',
  binderNo: '',
  folio: '',
  endFolio: '',
  sheetsCount: 0,
  media: [],
  status: 'Closed'
}

export enum InstrumentTypeEnum {
  EscrituraPublica = 'EscrituraPublica',
  OficioNotaria = 'OficioNotaria',
  TituloPropiedad = 'TituloPropiedad',
  DocumentoJuzgado = 'DocumentoJuzgado',
  DocumentoTerceros = 'DocumentoTerceros'
}

export type InstrumentType = 'EscrituraPublica' | 'OficioNotaria' | 'TituloPropiedad' | 'DocumentoJuzgado' | 'DocumentoTerceros';


export type InstrumentStatus = 'Opened' | 'Closed' | 'ReadOnly' | 'Secured' | 'Confidential';


export interface Recording {
  uid: string;
  recordingID: string;
  instrumentUID: string;
  transactionUID: string;
  recordedBy: Contact;
  recordingTime: DateString;
  reviewedBy: Contact;
  presentationTime: DateString;
  recordingSign: ElectronicSignData;
  recordingStatus: RecordingStatus;
}


export type RecordingStatus = 'Opened' | 'Closed' | 'Secured';


export interface ElectronicSignData {
  uid: string;
  documentUID: string;
  inputData: string;
  digitalSeal: string;
  securityCode: string;
  securityLabels: string[];
  esignature: string;
  signPurpose: string;
  mediaUID: string;
  signTime: DateString;
  signedBy: Contact;
  signedByPosition: string;
}


export interface Period {
  fromDate: DateString;
  toDate: DateString;
}


export interface InstrumentMedia {
  uid: string;
  type: string;
  typeName: string;
  mediaType: string;
  digitalizedBy: Contact;
  digitalizedTime: DateString;
  uri: string;
  instrumentUID: string;
}


export interface Contact {
  uid: string;
  name: string;
}
