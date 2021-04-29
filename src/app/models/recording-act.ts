/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Empty, Identifiable, Money, PartitionedType } from '@app/core';

import { EmptyRecordableSubject, RecordableObjectStatus, RecordableSubject } from './recordable-subjects';

import { EmptyInstrumentRecording, InstrumentRecording, RegistrationCommandConfig } from './registration';

import { RoledParty } from './party';


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
}


export type RecordingActEditableFields = 'Kinds' | 'OperationAmount' | 'Participants' | 'RecordingActType';


export interface RecordingAct extends Identifiable, PartitionedType {
  kind: string;
  description: string;
  operationAmount: number;
  currencyUID: string;
  recordableSubject: Identifiable;
  participants: RoledParty[];
  status: RecordableObjectStatus;
  actions: RecordingActActions;
}


export interface RecordingActActions {
  isEditable: boolean;
  editableFields: RecordingActEditableFields[];
  editionValues: {
    recordingActTypes: Identifiable[];
    kinds: string[];
    currencies: Identifiable[];
    mainParticipantRoles: Identifiable[];
    secondaryParticipantRoles: Identifiable[];
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


export interface SelectionAct {
  instrumentRecording: InstrumentRecording;
  recordingAct: RecordingActEntry;
}


export interface CancelationAct extends BaseRecordingAct {
  targetAct: RecordingActEntry;
  notes: string;
}


export interface ModificationAct extends BaseRecordingAct {
  targetAct: RecordingActEntry;
  parties: RoledParty[];
  operationAmount?: Money;
  notes: string;
}


export const EmptyRecordingActEntry: RecordingActEntry = {
  uid: 'Empty',
  name: '',
  recordableSubject: EmptyRecordableSubject,
  antecedent: ''
};


export const EmptyRecordingActActions: RecordingActActions = {
  isEditable: false,
  editableFields: [],
  editionValues: {
    recordingActTypes: [],
    kinds: [],
    currencies: [],
    mainParticipantRoles: [],
    secondaryParticipantRoles: [],
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
  participants: [],
  status: 'Incomplete',
  actions: EmptyRecordingActActions,
};


export const EmptySelectionAct: SelectionAct = {
  instrumentRecording: EmptyInstrumentRecording,
  recordingAct: EmptyRecordingActEntry
};
