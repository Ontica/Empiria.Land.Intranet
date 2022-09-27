/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Identifiable } from '@app/core';

import { Party, RecordingActParty } from './party';

import { RecordableSubject } from './recordable-subjects';


export enum RecordSearchType {
  RealEstate  = 'RealEstate',
  Association = 'Association',
  NoProperty  = 'NoProperty',
  Certificate = 'Certificate',
  Party       = 'Party',
  Instrument  = 'Instrument',
}


export const RecordSearchTypeList: Identifiable[] = [
  {uid: RecordSearchType.RealEstate,  name: 'Predios'},
  {uid: RecordSearchType.Association, name: 'Asociaciones'},
  {uid: RecordSearchType.NoProperty,  name: 'Documentos'},
  {uid: RecordSearchType.Party,       name: 'Personas'},
  // {uid: RecordSearchType.Certificate, name: 'Certificados'},
  // {uid: RecordSearchType.Instrument,  name: 'Inscripciones'},
];


export function isRecordableSubjectType(type: string) {
  return [RecordSearchType.RealEstate,
          RecordSearchType.Association,
          RecordSearchType.NoProperty].includes(type as RecordSearchType);
}


export interface RecordSearchData {
  queryExecuted: boolean;
  recordSearchQuery: RecordSearchQuery;
  records: RecordSearchResult[];
}


export interface RecordSearchQuery {
  type: string;
  municipality?: string;
  filterBy?: string;
  keywords: string;
}


export const EmptyRecordSearchQuery: RecordSearchQuery = {
  type: RecordSearchType.RealEstate,
  municipality: '',
  filterBy: '',
  keywords: '',
};


export interface RecordSearchResult {
  uid: string;
}


export const EmptyRecordSearchResult: RecordSearchResult = {
  uid: '',
}


export const EmptyRecordSearchData: RecordSearchData = {
  queryExecuted: false,
  recordSearchQuery: EmptyRecordSearchQuery,
  records: [],
}


export interface RecordableSubjectQueryResult extends RecordSearchResult {
  uid: string;
  type: string;
  name: string;
  electronicID: string;
  kind: string;
  status: string;
  recordableSubject: RecordableSubject;
  record: Record;
}


export interface RecordingActPartyQueryResult extends RecordSearchResult {
  uid: string;
  type: string;
  role: string;
  recordingActType: string;
  status: string;
  party: Party;
  recordableSubject: RecordableSubjectQueryResult;
  record: Record;
}


export interface Record {
  uid: string;
  recordID: string;
  recorderOffice: string;
  recordingTime: Date | string;
  recordedBy: string;
  authorizedBy: string;
  instrument: string;
  bookEntry: string;
  presentationTime: Date | string;
  transaction: RecordTransaction;

}


export interface RecordTransaction {
  uid: string;
  transactionID: string;
  internalControlNo: string;
}
