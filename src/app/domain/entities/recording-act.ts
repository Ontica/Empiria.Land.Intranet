/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Identifiable, PartitionedType, Money } from '@app/core';

import { Property } from './property';
import { RoledParty } from './party';


export interface RecordingActType extends Identifiable, PartitionedType {

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
