import { DateString, EmptyMediaBase, MediaBase } from '@app/core';

export interface Registration {
  uid: string;
  registrationID: string;
  physicalRecordings: PhysicalRecording[];
  stampMedia: MediaBase;
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
}


export interface PhysicalRecordingFields  {
  recorderOfficeUID: string;
  sectionUID: string;
}


export const EmptyRegistration: Registration = {
  uid: 'Empty',
  registrationID: '',
  physicalRecordings: [],
  stampMedia: EmptyMediaBase,
};
