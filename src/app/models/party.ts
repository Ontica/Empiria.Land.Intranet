/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Empty, Identifiable } from '@app/core';


export type PartUnit = 'Unit.Full' | 'Unit.Undivided' | 'Unit.Percentage' |
                       'AreaUnit.SquareMeters' | 'AreaUnit.Hectarea' | 'Unit.Fraction';


export type RecordingActPartyType  = 'Primary' | 'Secondary';


export interface RecordingActPartyFields {
  uid: string;
  type: RecordingActPartyType;
  party: PartyFields;
  roleUID: string;
  partAmount: string;
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


export interface PartyTypeItem {
  type: PartyType;
  typeName: string;
}


export const PartyTypeList: PartyTypeItem[] = [
  { type: 'Person', typeName: 'Persona' },
  { type: 'Organization', typeName: 'Organización' },
];


export interface Party {
  uid: string;
  type: PartyType;
  fullName: string;
  curp: string;
  rfc: string;
  notes: string;
}


export interface Party {
  uid: string;
  type: PartyType;
  fullName: string;
  curp: string;
  rfc: string;
  notes: string;
}


export interface PartyFilter {
  instrumentRecordingUID: string;
  recordingActUID: string;
  keywords: string;
}


export const EmptyParty: Party = {
  uid: 'Empty',
  type: 'Person',
  fullName: '',
  curp: '',
  rfc: '',
  notes: '',
};


export const EmptyRecordingActParty: RecordingActParty = {
  uid: 'Empty',
  type: 'Primary',
  party: EmptyParty,
  role: Empty,
  partAmount: 0,
  partUnit: Empty,
  associatedWith: EmptyParty,
  notes: '',
};
