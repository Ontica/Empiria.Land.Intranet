/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Assertion, DateString, Empty, EmptyMediaBase, Identifiable, MediaBase,
         PartitionedType } from '@app/core';


export enum SizeUnit {
  Empty             = 'Empty',
  NoRecord          = 'NoRecord',
  SquareMeters      = 'AreaUnit.SquareMeters',
  AproxSquareMeters = 'AreaUnit.AproxSquareMeters',
  Hectarea          = 'AreaUnit.Hectarea',
  AproxHectarea     = 'AreaUnit.AproxHectarea',
}


export function getSizeUnitNameShort(sizeUnit: Identifiable) {
  switch (sizeUnit.uid) {
    case SizeUnit.NoRecord:
      return 'No consta';

    case SizeUnit.SquareMeters:
      return 'm²';

    case SizeUnit.AproxSquareMeters:
      return 'm² aprox.';

    case SizeUnit.Hectarea:
      return 'Ha';

    case SizeUnit.AproxHectarea:
      return 'Ha aprox.';

    default:
      return sizeUnit.name;
  }
}


export enum RecordableSubjectType {
  None        = 'None',
  RealEstate  = 'RealEstate',
  Association = 'Association',
  NoProperty  = 'NoProperty',
}


export function getRecordableSubjectTypeName(type: RecordableSubjectType): string {
    switch (type) {
    case RecordableSubjectType.RealEstate:
      return 'Predio';
    case RecordableSubjectType.Association:
      return 'Asociación';
    case RecordableSubjectType.NoProperty:
      return 'Documento';
    case RecordableSubjectType.None:
      return 'Ninguno';
    default:
      throw Assertion.assertNoReachThisCode(`Unhandled type name for type '${type}'.`);
  }
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


export type RegistryEntryView = 'RecordingAct' | 'RecordableSubject';


export interface RegistryEntryActions {
  can: {
    editRecordableSubject: boolean;
  }
}


export const EmptyRegistryEntryActions: RegistryEntryActions = {
  can: {
    editRecordableSubject: false,
  }
}


export interface RegistryEntryData {
  instrumentRecordingUID: string;
  recordingActUID: string;
  title?: string;
  view?: RegistryEntryView;
  actions?: RegistryEntryActions;
}


export const EmptyRegistryEntryData: RegistryEntryData = {
  instrumentRecordingUID: '',
  recordingActUID: '',
  title: '',
  actions: EmptyRegistryEntryActions,
};


export function isRegistryEntryDataValid(data: RegistryEntryData): boolean {
    return !!data.instrumentRecordingUID && !!data.recordingActUID;
}


export interface RecordingContext {
  instrumentRecordingUID: string;
  recordingActUID: string;
}


export const EmptyRecordingContext: RecordingContext = {
  instrumentRecordingUID: '',
  recordingActUID: '',
};


export interface RecordableSubject extends Identifiable {
  electronicID: string;
  type: RecordableSubjectType;
  recorderOffice: Identifiable;
  kind: string;
  description: string;
  recordingContext: RecordingContext;
  status: RecordableObjectStatus;
}


export const EmptyRecordableSubject: RecordableSubject = {
  uid: '',
  type: RecordableSubjectType.None,
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


export interface RealEstate extends RecordableSubject {
  cadastralID: string;
  cadastreLinkingDate?: DateString;
  cadastralCardMedia?: MediaBase;
  municipality: Identifiable;
  lotSize: number;
  lotSizeUnit: Identifiable;
  buildingArea: number;
  undividedPct: number;
  description: string;
  metesAndBounds: string;
  section: string;
  block: string;
  lot: string;
}


export const EmptyRealEstate: RealEstate = {
  uid: '',
  type: RecordableSubjectType.None,
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
  buildingArea: -1,
  undividedPct: -1,
  description: '',
  metesAndBounds: '',
  section: '',
  block: '',
  lot: '',
  status: 'Incomplete',
};


export interface RealEstateFields extends RecordableSubjectFields {
  municipalityUID: string;
  cadastralID: string;
  description: string;
  metesAndBounds: string;
  lotSize: number;
  lotSizeUnitUID: string;
  buildingArea: number;
  undividedPct: number;
  section: string;
  block: string;
  lot: string;
}


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
  buildingArea: -1,
  undividedPct: -1,
  section: '',
  block: '',
  lot: '',
  description: '',
  metesAndBounds: '',
  status: 'Incomplete',
};
