/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Assertion, DateString, Empty, EmptyMediaBase, Identifiable, MediaBase, PartitionedType } from '@app/core';


export enum RecordableSubjectType {
  None        = 'None',
  RealEstate  = 'RealEstate',
  Association = 'Association',
  NoProperty  = 'NoProperty',
}


export type RecordableObjectStatus = 'Registered' | 'Incomplete' | 'NotLegible' | 'Obsolete';


export interface RecordableObjectStatusItem {
  status: RecordableObjectStatus;
  statusName: string;
}


export const RecordableObjectStatusList: RecordableObjectStatusItem[] = [
  { status: 'Registered', statusName: 'Completo' },
  { status: 'Incomplete', statusName: 'Incompleto' },
  { status: 'NotLegible', statusName: 'No legible' },
  { status: 'Obsolete',   statusName: 'Obsoleto' },
];


export const RecordableSubjectTypeList: Identifiable[] = [
  {uid: RecordableSubjectType.RealEstate,  name: 'Predios'},
  {uid: RecordableSubjectType.Association, name: 'Asociaciones'},
  {uid: RecordableSubjectType.NoProperty,  name: 'Documentos'},
];

export function getRecordableObjectStatusName(status: RecordableObjectStatus): RecordableObjectStatusItem {
    switch (status) {
    case 'Registered':
      return RecordableObjectStatusList[0];
    case 'Incomplete':
      return RecordableObjectStatusList[1];
    case 'NotLegible':
      return RecordableObjectStatusList[2];
    case 'Obsolete':
      return RecordableObjectStatusList[3];
    default:
      throw Assertion.assertNoReachThisCode(`Unhandled status name for status '${status}'.`);
  }
}


export interface RecordableSubjectFilter {
  type: RecordableSubjectType;
  keywords: string;
}


export const EmptyRecordableSubjectFilter: RecordableSubjectFilter = {
  type: null,
  keywords: '',
};


export interface RecordableSubjectFields {
  uid: string;
  type: RecordableSubjectType;
  electronicID: string;
  recorderOfficeUID: string;
  kind: string;
  status?: RecordableObjectStatus;
}


export interface AssociationFields extends RecordableSubjectFields {
  name: string;
  description: string;
}


export interface NoPropertyFields extends RecordableSubjectFields {
  name: string;
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
  recorderOffice: Identifiable;
  kind: string;
  description: string;
  recordingContext: RecordingContext;
  status: RecordableObjectStatus;
}


export const EmptyRecordableSubject: RecordableSubject = {
  uid: '',
  type: '',
  electronicID: '',
  recorderOffice: Empty,
  kind: '',
  name: '',
  description: '',
  recordingContext: EmptyRecordingContext,
  status: 'Incomplete',
};


export interface RecordableSubjectShortModel extends Identifiable, PartitionedType {
  electronicID: string;
  kind: string;
}


export interface RecordableSubjectData {
  queryExecuted: boolean;
  recordableSubjectFilter: RecordableSubjectFilter;
  recordableSubjects: RecordableSubjectShortModel[];
}


export const EmptyRecordableSubjectData: RecordableSubjectData = {
  queryExecuted: false,
  recordableSubjectFilter: EmptyRecordableSubjectFilter,
  recordableSubjects: [],
}


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
  status: 'Incomplete',
};


export interface RealEstateFields extends RecordableSubjectFields {
  municipalityUID: string;
  cadastralID: string;
  description: string;
  metesAndBounds: string;
  lotSize: number;
  lotSizeUnitUID: string;
}


export interface TractIndex {
  recordableSubject: RecordableSubject;
  tractIndex: TractIndexEntry[];
}


export interface TractIndexEntry {
  recordingActUID: string;
  recordingActName: string;
  antecedent: string;
  presentationTime: DateString;
  recordingDate: DateString;
}


export const EmptyTractIndex: TractIndex = {
  recordableSubject: EmptyRecordableSubject,
  tractIndex: [],
};


export const EmptyRecordableSubjectFields: RecordableSubjectFields = {
  uid: '',
  type: RecordableSubjectType.None,
  electronicID: '',
  recorderOfficeUID: '',
  kind: '',
  status: 'Incomplete',
};


export const EmptyAssociationFields: AssociationFields = {
  uid: '',
  type: RecordableSubjectType.None,
  electronicID: '',
  recorderOfficeUID: '',
  kind: '',
  name: '',
  description: '',
  status: 'Incomplete',
};


export const EmptyNoPropertyFields: NoPropertyFields = {
  uid: '',
  type: RecordableSubjectType.None,
  electronicID: '',
  recorderOfficeUID: '',
  kind: '',
  name: '',
  description: '',
  status: 'Incomplete',
};


export const EmptyRealEstateFields: RealEstateFields = {
  uid: '',
  type: RecordableSubjectType.RealEstate,
  electronicID: '',
  recorderOfficeUID: '',
  kind: '',
  municipalityUID: '',
  cadastralID: '',
  lotSize: -1,
  lotSizeUnitUID: '',
  description: '',
  metesAndBounds: '',
  status: 'Incomplete',
};
