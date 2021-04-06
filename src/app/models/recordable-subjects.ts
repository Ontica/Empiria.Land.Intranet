/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, EmptyMediaBase, Identifiable, MediaBase, PartitionedType } from '@app/core';


export type RecordableSubjectType = 'None' | 'RealEstate' | 'Association' | 'NoProperty';

export interface RecordableSubjectFields {
  uid: string;
  type: RecordableSubjectType;
  electronicID: string;
  recorderOfficeUID: string;
  kind: string;
}


// tslint:disable-next-line: no-empty-interface
export interface AssociationFields extends RecordableSubjectFields {
  name: string;
}


// tslint:disable-next-line: no-empty-interface
export interface NoPropertyFields extends RecordableSubjectFields {
  description: string;
}


export interface RecordingContext {
  instrumentUID: string;
  recordingActUID: string;
}


export const EmptyRecordingContext: RecordingContext = {
  instrumentUID: '',
  recordingActUID: ''
};


export interface RecordableSubject extends Identifiable, PartitionedType {
  electronicID: string;
  kind: string;
  recorderOffice: Identifiable;
  recordingContext: RecordingContext;
}


export const EmptyRecordableSubject: RecordableSubject = {
  uid: '',
  type: '',
  electronicID: '',
  name: '',
  recorderOffice: Empty,
  kind: '',
  recordingContext: EmptyRecordingContext
};


export interface RealEstate extends RecordableSubject {
  cadastralID: string;
  cadastreLinkingDate?: DateString;
  cadastralCardMedia?: MediaBase;
  municipality: Identifiable;
  lotSize: number;
  lotSizeUnit: Identifiable;
  description: string;
  metesAndBounds: string;
}

export const EmptyRealEstate: RealEstate = {
  uid: '',
  type: '',
  name: '',
  electronicID: '',
  kind: '',
  recordingContext: EmptyRecordingContext,
  cadastralID: '',
  cadastreLinkingDate: '',
  cadastralCardMedia: EmptyMediaBase,
  recorderOffice: Empty,
  municipality: Empty,
  lotSize: -1,
  lotSizeUnit: Empty,
  description: '',
  metesAndBounds: '',
};


export interface RealEstateFields extends RecordableSubjectFields {
  municipalityUID: string;
  cadastralID: string;
  description: string;
  metesAndBounds: string;
  lotSize: number;
  lotSizeUnitUID: string;
}


export const EmptyRecordableSubjectFields: RecordableSubjectFields = {
  uid: '',
  type: 'None',
  electronicID: '',
  recorderOfficeUID: '',
  kind: ''
};


export const EmptyAssociationFields: AssociationFields = {
  uid: '',
  type: 'None',
  electronicID: '',
  recorderOfficeUID: '',
  kind: '',
  name: ''
};


export const EmptyNoPropertyFields: NoPropertyFields = {
  uid: '',
  type: 'None',
  electronicID: '',
  recorderOfficeUID: '',
  kind: '',
  description: ''
};


export const EmptyRealEstateFields: RealEstateFields = {
  uid: '',
  type: 'RealEstate',
  electronicID: '',
  recorderOfficeUID: '',
  kind: '',
  municipalityUID: '',
  cadastralID: '',
  lotSize: -1,
  lotSizeUnitUID: '',
  description: '',
  metesAndBounds: ''
};
