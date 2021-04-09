/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, EmptyMediaBase, Identifiable, MediaBase } from '@app/core';

import { EmptyInstrument, Instrument, InstrumentFields } from './instrument';

import { RealEstate, RecordableSubjectType } from './recordable-subjects';

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


export interface InstrumentBookEntry {
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


export interface InstrumentBookEntryFields  {
  recorderOfficeUID: string;
  sectionUID: string;
}


export type RecordingStatus = 'Opened' | 'Closed' | 'Secured';


export interface InstrumentRecordingActions {
  can: {
    editInstrument: boolean;
    openInstrument: boolean;
    closeInstrument: boolean;
    deleteInstrument: boolean;
    uploadInstrumentFiles: boolean;

    editRecordingActs: boolean;

    createNextRecordingBookEntries: boolean;
    deleteRecordingBookEntries: boolean;
  };
  show: {
    files?: boolean;
    recordingActs?: boolean;
    recordingBookEntries?: boolean;
    registrationStamps?: boolean;
  };
}


export const EmptyInstrumentRecordingActions: InstrumentRecordingActions = {
  can: {
    editInstrument: false,
    openInstrument: false,
    closeInstrument: false,
    deleteInstrument: false,
    uploadInstrumentFiles: false,

    editRecordingActs: false,

    createNextRecordingBookEntries: false,
    deleteRecordingBookEntries: false
  },
  show: {
    files: false,
    recordingActs: false,
    recordingBookEntries: false,
    registrationStamps: false,
  }
};


export interface InstrumentRecording {
  uid: string;
  instrumentRecordingID: string;
  instrument: Instrument;
  // presentationTime: DateString;
  // recordingTime: DateString;
  // recordedBy: Contact;
  // reviewedBy: Contact;
  // signedBy: Contact;
  recordingActs: RecordingAct[];
  bookEntries?: InstrumentBookEntry[];
  stampMedia: MediaBase;
  // status: RecordingStatus;
  transactionUID?: string;
  actions: InstrumentRecordingActions;
}


export const EmptyInstrumentRecording: InstrumentRecording = {
  uid: 'Empty',
  instrumentRecordingID: 'No determinado',
  instrument: EmptyInstrument,
  // presentationTime: '',
  // recordingTime: '',
  // recordedBy: EmptyContact,
  // reviewedBy: EmptyContact,
  // signedBy: EmptyContact,
  recordingActs: [],
  bookEntries: [],
  stampMedia: EmptyMediaBase,
  // status: 'Secured',
  transactionUID: 'Empty',
  actions: EmptyInstrumentRecordingActions
};


export interface RegistrationCommand {
  type: string;
  payload: RegistrationCommandPayload;
}


export interface RegistrationCommandPayload {
  recordingActTypeUID: string;
  recordableSubjectUID?: string;
  partitionType?: string;
  partitionNo?: string;
}


export interface RegistrationCommandRule {
  subjectType: RecordableSubjectType;
  selectSubject: boolean;
  selectTargetAct: boolean;
  newPartition: boolean;
}


export const EmptyRegistrationCommandRule: RegistrationCommandRule = {
  subjectType: 'None',
  selectSubject: false,
  selectTargetAct: false,
  newPartition: false,
};


export interface RegistrationCommandConfig extends Identifiable {
  rules: RegistrationCommandRule;
}


// ToDo: review these types

export interface RegistrationEntry {
  recordingAct: RecordingAct;
  registration: Identifiable;
  registrationMode: string;
}


export interface RealEstateStructure {
  realEstate: RealEstate;
  partitionOf?: RealEstate;
  partitionType?: string;
  partitionName?: string;
  mergedInto?: RealEstate;
  children: RealEstateStructure[];
  structureActs: RegistrationEntry[];
}


export type RecordingBookStatus = 'Opened' | 'Closed' | 'Secured';


export interface RecordingBook {
  uid: string;
  recorderOffice: Identifiable;
  recordingSection: Identifiable;
  volumeNo: string;
  status: RecordingBookStatus;
  bookEntries: BookEntry[];
}


export const EmptyRecordingBook: RecordingBook = {
  uid: 'Empty',
  recorderOffice: Empty,
  recordingSection: Empty,
  volumeNo: '',
  status: 'Closed',
  bookEntries: [],
};


export interface BookEntry {
  uid: string;
  recordingTime: DateString;
  recorderOfficeName: string;
  recordingSectionName: string;
  volumeNo: string;
  recordingNo: string;
  recordedBy: string;
  instrumentRecording: {
    uid: string;
    controlID: string;
    asText: string;
  };
  status: RecordingStatus;
  stampMedia: MediaBase;
}


export const EmptyBookEntry: BookEntry = {
  uid: '',
  recordingTime: '',
  recorderOfficeName: '',
  recordingSectionName: '',
  volumeNo: '',
  recordingNo: '',
  recordedBy: '',
  instrumentRecording: {
    uid: '',
    controlID: '',
    asText: '',
  },
  status: 'Closed',
  stampMedia: EmptyMediaBase,
};


export interface BookEntryFields {
  instrument: InstrumentFields;
  recordingBookUID: string;
  recordingTime: DateString;
  recordingNo: string;
}
