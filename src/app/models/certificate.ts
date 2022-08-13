/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString } from "@app/core";

import { MediaFile } from "./files";

import { EmptyRecordableSubject, RecordableSubject, RecordableSubjectType } from "./recordable-subjects";


export interface CertificateType {
  uid: string;
  name: string;
  issuingCommands: IssuingCommands[];
}


export interface IssuingCommands {
  uid: string;
  name: string;
  rules: CertificateRules;
}


export interface CertificateRules {
  subjectType: RecordableSubjectType;
  selectSubject: boolean;
  selectBookEntry: boolean;
}


export const EmptyCertificateRules: CertificateRules = {
  subjectType: null,
  selectSubject: false,
  selectBookEntry: false,
};


export interface Certificate {
  uid: string;
  type: string;
  certificateID: string;
  recordableSubject: RecordableSubject;
  mediaLink: MediaFile;
  status: string;
  issueTime?: DateString;
}


export const EmptyCertificate: Certificate = {
  uid: '',
  type: '',
  certificateID: '',
  recordableSubject: EmptyRecordableSubject,
  mediaLink: null,
  status: '',
  issueTime: null,
}


export interface CreateCertificateCommand {
  type: string;
  payload: CreateCertificateCommandPayload;
}


export interface CreateCertificateCommandPayload {
  certificateTypeUID: string;
  recordableSubjectUID?: string;
  recordingBookUID?: string;
  bookEntryUID?: string;
  bookEntryNo?: string;
}
