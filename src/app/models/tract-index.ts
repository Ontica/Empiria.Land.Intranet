/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, EmptyMediaBase, Identifiable, MediaBase } from '@app/core';

import { EmptyRecordableSubject, RecordableSubject } from './recordable-subjects';


export interface TractIndex {
  recordableSubject: RecordableSubject;
  entries: TractIndexEntry[];
  structure: StructureEntry[];
}


export enum TractIndexEntryType {
  RecordingAct = 'RecordingAct',
  Certificate = 'Certificate',
}


export const TractIndexEntryTypeList: Identifiable[] = [
  { uid: TractIndexEntryType.RecordingAct, name: 'Acto Jurídico' },
  { uid: TractIndexEntryType.Certificate, name: 'Certificado' },
];


export interface StructureEntry {

}


export interface TractIndexEntry {
  uid: string;
  entryType: TractIndexEntryType;
  description: string;
  requestedTime: DateString;
  issueTime: DateString;
  status: string;
  transaction: TransactionInfo,
  officialDocument: OfficialDocument,
  subjectChanges: RecordableSubjectChanges;
}


export interface TransactionInfo {
  uid: string;
  transactionID: string;
  requestedBy: string;
  agency: Identifiable;
  filingOffice: Identifiable;
  presentationTime: DateString;
  completedTime: DateString;
  status: string;
}


export interface OfficialDocument {
  uid: string;
  type: string;
  documentID: string;
  description: string;
  office: Identifiable;
  issueTime: DateString;
  elaboratedBy: string;
  authorizedBy: string;
  status: string;
  media: MediaBase;
}


export interface RecordableSubjectChanges {
  summary: string;
  snapshot: RecordableSubject;
  structureChanges: StructureChange[];
}


export interface StructureChange {
  operation: string;
  operationType: string;
  relatedSubject: RecordableSubject;
}


export const EmptyTractIndex: TractIndex = {
  recordableSubject: EmptyRecordableSubject,
  entries: [],
  structure: [],
};


export const EmptyTransactionInfo: TransactionInfo = {
  uid: '',
  transactionID: '',
  requestedBy: '',
  agency: Empty,
  filingOffice: Empty,
  presentationTime: '',
  completedTime: '',
  status: '',
}


export const EmptyOfficialDocument: OfficialDocument = {
  uid: '',
  type: '',
  documentID: '',
  description: '',
  office: Empty,
  issueTime: '',
  elaboratedBy: '',
  authorizedBy: '',
  status: '',
  media: EmptyMediaBase,
}


export const EmptyStructureChange: StructureChange = {
  operation: '',
  operationType: '',
  relatedSubject: EmptyRecordableSubject,
}


export const EmptyRecordableSubjectChanges: RecordableSubjectChanges = {
  summary: '',
  snapshot: EmptyRecordableSubject,
  structureChanges: [],
}


export const EmptyTractIndexEntry: TractIndexEntry = {
  uid: '',
  entryType: TractIndexEntryType.RecordingAct,
  description: '',
  requestedTime: '',
  issueTime: '',
  status: '',
  transaction: EmptyTransactionInfo,
  officialDocument: EmptyOfficialDocument,
  subjectChanges: EmptyRecordableSubjectChanges,
};
