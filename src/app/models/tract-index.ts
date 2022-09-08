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
  actions: TractIndexActions;
}


export interface TractIndexActions {
  canBeClosed: boolean;
  canBeOpened: boolean;
  canBeUpdated: boolean;
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


export interface TractIndexEntryActions {
  canBeClosed: boolean;
  canBeDeleted: boolean;
  canBeOpened: boolean;
  canBeUpdated: boolean;
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
  actions: TractIndexEntryActions;
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
  bookEntry: BookEntryContext;
  issueTime: DateString;
  elaboratedBy: string;
  authorizedBy: string;
  status: string;
  media: MediaBase;
}


export interface BookEntryContext {
  uid: string;
  recordingBookUID: string;
  instrumentRecordingUID: string;
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


export const EmptyTractIndexActions: TractIndexActions = {
  canBeClosed: false,
  canBeOpened: false,
  canBeUpdated: false,
}


export const EmptyTractIndex: TractIndex = {
  recordableSubject: EmptyRecordableSubject,
  entries: [],
  structure: [],
  actions: EmptyTractIndexActions,
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


export const EmptyBookEntryContext: BookEntryContext = {
  uid: '',
  recordingBookUID: '',
  instrumentRecordingUID: '',
}


export const EmptyOfficialDocument: OfficialDocument = {
  uid: '',
  type: '',
  documentID: '',
  description: '',
  office: Empty,
  bookEntry: EmptyBookEntryContext,
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


export const EmptyTractIndexEntryActions: TractIndexEntryActions = {
  canBeClosed: false,
  canBeDeleted: false,
  canBeOpened: false,
  canBeUpdated: false
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
  actions: EmptyTractIndexEntryActions,
};
