/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Identifiable, Money, PartitionedType } from '@app/core';

import { Property } from './property';
import { RoledParty } from './party';


export interface RecordingActTypeGroup extends Identifiable {
  recordingActTypes: RecordingActType[];
}


export interface RecordingActType extends Identifiable {
  subjectCommands?: Identifiable[];
}


export interface RecordingDocument extends Identifiable, PartitionedType {
  recordingActs: RecordingAct[];
}


export interface BaseRecordingAct extends Identifiable {
  type: RecordingActType;
}


export interface RecordingAct extends BaseRecordingAct {
   property: Property;
   parties: RoledParty[];
   operationAmount?: Money;
   notes: string;
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
  type: null,
  property: null,
  parties: [],
  operationAmount: null,
  notes: '',
};
