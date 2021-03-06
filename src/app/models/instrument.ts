/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString } from '@app/core';

import { EmptyRegistration, Registration } from './registration';


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


export interface InstrumentActions {
  can: {
    edit?: boolean;
    open?: boolean;
    close?: boolean;
    delete?: boolean;
    uploadFiles?: boolean;
    editRecordingActs?: boolean;
    createPhysicalRecordings?: boolean;
    deletePhysicalRecordings?: boolean;
    linkPhysicalRecordings?: boolean;
    editPhysicalRecordingActs?: boolean;
  };
  show: {
    files?: boolean;
    recordingActs?: boolean;
    physicalRecordings?: boolean;
    registrationStamps?: boolean;
  };
}


export const EmptyInstrumentActions: InstrumentActions = {
  can: {
    edit: false,
    open: false,
    close: false,
    delete: false,
    uploadFiles: false,
    editRecordingActs: false,
    createPhysicalRecordings: false,
    deletePhysicalRecordings: false,
    linkPhysicalRecordings: false,
    editPhysicalRecordingActs: false,
  },
  show: {
    files: false,
    recordingActs: false,
    physicalRecordings: false,
    registrationStamps: false,
  }
};


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
  registration: Registration;
  actions: InstrumentActions;
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
  status: 'Opened',
  registration: EmptyRegistration,
  actions: EmptyInstrumentActions,
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


export interface InstrumentMedia {
  uid: string;
  type: string;
  content: InstrumentMediaContent;
  name: string;
  url: string;
  size: number;
}


export type InstrumentMediaContent = 'InstrumentMainFile' | 'InstrumentAuxiliaryFile';
