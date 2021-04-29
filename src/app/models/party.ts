/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Identifiable } from '@app/core';


export type RecordingActPartyType  = 'Primary' | 'Secondary';


export interface RecordingActPartyFields {
  uid: string;
  type: RecordingActPartyType;
  recordingActUID: string;
  party: PartyFields;
  roleUID: string;
  partAmount: number;
  partUnitUID: string;
  associatedWithUID: string;
  notes: string;
}


export interface PartyFields {
  uid: string;
  type: PartyType;
  fullName: string;
  curp: string;
  rfc: string;
  notes: string;
}


export interface RecordingActParty {
  uid: string;
  type: RecordingActPartyType;
  party: Party;
  role: Identifiable;
  partAmount: number;
  partUnit: Identifiable;
  associatedWith: Party;
  notes: string;
}


export type PartyType  = 'Person' | 'Organization';


export interface Party {
  uid: string;
  type: PartyType;
  fullName: string;
  curp: string;
  rfc: string;
  notes: string;
}
