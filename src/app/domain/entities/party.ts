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
  Of: Party;
}
