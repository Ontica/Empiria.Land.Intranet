/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Identifiable } from "@app/core";

import { TransactionsOperationType } from "./transaction";

import { LandQuery } from "./land-list";


export enum ESignStatus {
  Unsigned = 'Unsigned',
  Signed   = 'Signed',
  Refused  = 'Refused',
  Revoked  = 'Revoked',
}


export const ESignStatusList: Identifiable[] = [
  { uid: ESignStatus.Unsigned, name: 'Pendientes de firmar' },
  { uid: ESignStatus.Signed,   name: 'Firmados' },
  { uid: ESignStatus.Refused,  name: 'Rechazados' },
  { uid: ESignStatus.Revoked,  name: 'Revocados' },
];


export interface ESignRequestsQuery extends LandQuery {
  status: ESignStatus;
  keywords: string;
}


export const EmptyESignRequestsQuery: ESignRequestsQuery = {
  status: ESignStatus.Unsigned,
  keywords: '',
};


export enum ESignOperationType {
  ESignMultiple = 'e-sign-multiple',
  RevokeESignMultiple = 'revoke-e-sign-multiple',
  RejectESignMultiple = 'reject-e-sign-multiple',
}


export const ESignOperationsList: Identifiable[] = [
  { uid: TransactionsOperationType.UpdateWorkflowMultiple, name: 'Cambiar estado' },
  { uid: ESignOperationType.ESignMultiple,          name: 'Firmar' },
  { uid: ESignOperationType.RevokeESignMultiple,    name: 'Revocar' },
  { uid: ESignOperationType.RejectESignMultiple,    name: 'Rechazar' },
];
