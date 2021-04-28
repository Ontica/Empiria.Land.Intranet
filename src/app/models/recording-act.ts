/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Identifiable, Money, PartitionedType } from '@app/core';

import { EmptyRecordableSubject, RecordableSubject } from './recordable-subjects';
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


export interface SelectionAct {
  instrumentRecording: InstrumentRecording;
  recordingAct: RecordingActEntry;
}


export const EmptyRecordingActEntry: RecordingActEntry = {
  uid: 'Empty',
  name: '',
  recordableSubject: EmptyRecordableSubject,
  antecedent: ''
};


export const EmptySelectionAct: SelectionAct = {
  instrumentRecording: EmptyInstrumentRecording,
  recordingAct: EmptyRecordingActEntry
};
