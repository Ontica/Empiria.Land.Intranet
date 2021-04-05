/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Identifiable, Money, PartitionedType } from '@app/core';

import { EmptyRecordableSubject, RecordableSubject } from './recordable-subjects';
import { RegistrationCommandConfig } from './registration';

import { RoledParty } from './party';


export interface RecordingActTypeGroup extends Identifiable {
  recordingActTypes: RecordingActType[];
}


export interface RecordingActType extends Identifiable {
  registrationCommands?: RegistrationCommandConfig[];
}


export interface RecordingDocument extends Identifiable, PartitionedType {
  recordingActs: RecordingAct[];
}


export interface BaseRecordingAct extends Identifiable {
  antecedent: string;
}


export interface RecordingAct extends BaseRecordingAct {
  recordableSubject: RecordableSubject;
  parties: RoledParty[];
  operationAmount?: Money;
}


export interface CancelationAct extends BaseRecordingAct {
  targetAct: RecordingAct;
  notes: string;
}


export interface ModificationAct extends BaseRecordingAct {
  targetAct: RecordingAct;
  parties: RoledParty[];
  operationAmount?: Money;
  notes: string;
}


export const EmptyRecordingAct: RecordingAct = {
  uid: 'Empty',
  name: '',
  recordableSubject: EmptyRecordableSubject,
  parties: [],
  operationAmount: null,
  antecedent: ''
};
