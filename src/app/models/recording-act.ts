/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Empty, Identifiable, PartitionedType } from '@app/core';

import { RecordingActParty } from './party';

import { EmptyRecordableSubject, RecordableObjectStatus, RecordableSubject } from './recordable-subjects';

import { RegistrationCommandConfig } from './registration';

export interface RecordingActTypeGroup extends Identifiable {
  recordingActTypes: RecordingActType[];
}


export interface RecordingActType extends Identifiable {
  registrationCommands?: RegistrationCommandConfig[];
}


export interface RecordingDocument extends Identifiable, PartitionedType {
  recordingActs: RecordingActEntry[];
}


export interface BaseRecordingAct extends Identifiable {
  antecedent: string;
}


export interface RecordingActEntry extends BaseRecordingAct {
  recordableSubject: RecordableSubject;
  relatedSubject: RecordableSubject;
  description: string;
}


export type RecordingActEditableFields = 'Kinds' | 'OperationAmount' | 'Participants' | 'RecordingActType';


export interface RecordingAct extends Identifiable, PartitionedType {
  kind: string;
  description: string;
  operationAmount: number;
  currencyUID: string;
  recordableSubject: Identifiable;
  parties: RecordingActParty[];
  status: RecordableObjectStatus;
  actions: RecordingActActions;
}


export interface RecordingActActions {
  isEditable: boolean;
  editableFields: RecordingActEditableFields[];
  editionValues: {
    currencies: Identifiable[];
    kinds: string[];
    partUnits: Identifiable[];
    primaryPartyRoles: Identifiable[];
    recordingActTypes: Identifiable[];
    secondaryPartyRoles: Identifiable[];
  };
}


export interface RecordingActFields {
  description: string;
  typeUID?: string;
  kind?: string;
  operationAmount?: number;
  currencyUID?: string;
  status: RecordableObjectStatus;
}


export const EmptyRecordingActEntry: RecordingActEntry = {
  uid: 'Empty',
  name: '',
  description: '',
  antecedent: '',
  recordableSubject: EmptyRecordableSubject,
  relatedSubject: EmptyRecordableSubject,
};


export const EmptyRecordingActActions: RecordingActActions = {
  isEditable: false,
  editableFields: [],
  editionValues: {
    currencies: [],
    kinds: [],
    partUnits: [],
    primaryPartyRoles: [],
    recordingActTypes: [],
    secondaryPartyRoles: [],
  }
};


export const EmptyRecordingAct: RecordingAct = {
  uid: 'Empty',
  name: '',
  type: '',
  kind: '',
  description: '',
  operationAmount: 0,
  currencyUID: '',
  recordableSubject: Empty,
  parties: [],
  status: 'Incomplete',
  actions: EmptyRecordingActActions,
};
