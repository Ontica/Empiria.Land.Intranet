/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Contact, DateString, EmptyMediaBase, Identifiable, MediaBase } from '@app/core';

import { RecordingAct } from './recording-act';


// tslint:disable-next-line: no-empty-interface
export interface RecorderOffice extends Identifiable {
  municipalities: Identifiable[];
  recordingSections: Identifiable[];
}


export const EmptyRecorderOffice: RecorderOffice = {
  uid: '',
  name: '',
  municipalities: [],
  recordingSections: [],
};


// tslint:disable-next-line: no-empty-interface
export interface RecordingSection extends Identifiable {

}


export interface PhysicalRecording {
  uid: string;
  recordingTime: DateString;
  recorderOfficeName: string;
  recordingSectionName: string;
  volumeNo: string;
  recordingNo: string;
  recordedBy: string;
  stampMedia: MediaBase;
  recordingActs: RecordingAct[];
}


export interface PhysicalRecordingFields  {
  recorderOfficeUID: string;
  sectionUID: string;
}


export interface Registration {
  uid: string;
  registrationID: string;
  instrumentID: string;
  transactionUID?: string;
  physicalRecordings: PhysicalRecording[];
  stampMedia: MediaBase;
}


export const EmptyRegistration: Registration = {
  uid: 'Empty',
  registrationID: '',
  instrumentID: '',
  transactionUID: 'Empty',
  physicalRecordings: [],
  stampMedia: EmptyMediaBase,
};


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
