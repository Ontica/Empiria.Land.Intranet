/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString } from '@app/core';


export interface Period {
  fromDate: DateString;
  toDate: DateString;
}


export const EmptyPeriod: Period = {
  fromDate: '',
  toDate: ''
};


export interface Issuer {
  uid: string;
  name: string;
  officialPosition: string;
  entity: string;
  place: string;
  period: Period;
}


export const EmptyIssuer: Issuer = {
  uid: 'Empty',
  name: 'No determinado',
  officialPosition: '',
  entity: 'No determinado',
  place: 'No determinado',
  period: EmptyPeriod
};

export interface IssuersFilter {
  instrumentType: string;
  instrumentKind: string;
  onDate: DateString;
  keywords: string;
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
  issuer: EmptyIssuer,
  summary: '',
  asText: '',
  controlID: '',
  instrumentNo: '',
  binderNo: '',
  folio: '',
  endFolio: '',
  sheetsCount: null,
  media: [],
  status: 'Opened'
};

export const InstrumentTypesList: any[] = [
  { type: 'EscrituraPublica', typeName: 'Escritura pública' },
  { type: 'OficioNotaria', typeName: 'Oficio de notaría' },
  { type: 'DocumentoJuzgado', typeName: 'Documento de juzgado' },
  { type: 'TituloPropiedad', typeName: 'Título de propiedad' },
  { type: 'DocumentoTerceros', typeName: 'Documento de terceros' }
];

export enum InstrumentTypeEnum {
  EscrituraPublica = 'EscrituraPublica',
  OficioNotaria = 'OficioNotaria',
  TituloPropiedad = 'TituloPropiedad',
  DocumentoJuzgado = 'DocumentoJuzgado',
  DocumentoTerceros = 'DocumentoTerceros'
}


export type InstrumentType = 'EscrituraPublica' | 'OficioNotaria' | 'TituloPropiedad' |
                             'DocumentoJuzgado' | 'DocumentoTerceros';


export interface InstrumentFields  {
  uid?: string;
  type?: InstrumentType;
  kind?: string;
  issuerUID?: string;
  issueDate?: DateString;
  summary?: string;
  instrumentNo?: string;
  binderNo?: string;
  folio?: string;
  endFolio?: string;
  sheetsCount?: number;
}

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
