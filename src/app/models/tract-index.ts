/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, EmptyMediaBase, Identifiable, MediaBase } from '@app/core';

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
  type: TractIndexEntryType;
  name: string;
  documentID: string;
  transactionID: string;
  presentationTime: DateString;
  recordingTime: DateString;
  stampMedia: MediaBase;
  instrumentRecordingUID: string;
  recordableSubject: RecordableSubject;
  status: string;
}


export const EmptyTractIndex: TractIndex = {
  recordableSubject: EmptyRecordableSubject,
  entries: [],
  structure: [],
};


export const EmptyTractIndexEntry: TractIndexEntry = {
  uid: '',
  type: TractIndexEntryType.RecordingAct,
  name: '',
  documentID: '',
  transactionID: '',
  presentationTime: '',
  recordingTime: '',
  stampMedia: EmptyMediaBase,
  instrumentRecordingUID: '',
  recordableSubject: EmptyRecordableSubject,
  status: '',
};
