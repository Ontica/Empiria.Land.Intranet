/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Identifiable, PartitionedType, Quantity } from '@app/core';


export interface Party extends Identifiable, PartitionedType {
  notes: string;
}


export interface Person extends Party {
  curp: string;
  governmentID: string;
  governmentIDType: string;
}


export interface Role extends Identifiable, PartitionedType {

}


export interface RoledParty {
  uid: string;
  party: Party;
  role: Role;
}

export interface OwnerParty extends RoledParty {
  ownership: Quantity;
}


export interface PartyOf extends RoledParty {
  of: Party;
}

//////////
// JM: temporal
//////////

export interface Identification {
  typeIdentification?: Identifiable;
  numberIdentification?: string;
}

export interface ParticipationParty {
  role: Role;
  participationType: Identifiable;
  participationAmount: number;
  observations: string;
}

export interface RecordingActParty  extends Person, ParticipationParty {
  identification?: Identification;
  partiesList?: RecordingActParty[];
  of?: RecordingActParty[];
}

// Enumerations

export enum RolesGroupEnum {
  primary = '1',
  secondary = '2',
}

export enum PartyTypesEnum {
  person = '1',
  Organization = '2',
}

export enum participationTypeEnum {
  todo = '1',
  proIndiviso = '2',
  porcentaje = '3',
  m2 = '4',
  hectarea = '5'
}
