/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString } from '@app/core';

import { MediaFile } from './reporting';


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
  media: MediaFile[];
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
  media: []
};


export enum InstrumentType {
  EscrituraPublica  = 'EscrituraPublica',
  OficioNotaria     = 'OficioNotaria',
  TituloPropiedad   = 'TituloPropiedad',
  DocumentoJuzgado  = 'DocumentoJuzgado',
  DocumentoTerceros = 'DocumentoTerceros',
  Resumen           = 'Resumen',
}


export interface InstrumentTypeItem {
  type: InstrumentType;
  typeName: string;
}


export const InstrumentTypesList: InstrumentTypeItem[] = [
  { type: InstrumentType.EscrituraPublica,  typeName: 'Escritura pública' },
  { type: InstrumentType.OficioNotaria,     typeName: 'Oficio de notaría' },
  { type: InstrumentType.DocumentoJuzgado,  typeName: 'Documento de juzgado' },
  { type: InstrumentType.TituloPropiedad,   typeName: 'Título de propiedad' },
  { type: InstrumentType.DocumentoTerceros, typeName: 'Documento de terceros' },
  { type: InstrumentType.Resumen,           typeName: 'Resumen' },
];


export interface InstrumentFields {
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


export type InstrumentMediaContent = 'InstrumentMainFile' | 'InstrumentAuxiliaryFile';
