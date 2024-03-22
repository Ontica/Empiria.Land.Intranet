/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Identifiable } from '@app/core';

import { LandQuery } from './land-list';


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
  UpdateStatus = 'update-status',
  Sign         = 'sign',
  Revoke       = 'revoke',
  Refuse       = 'refuse',
  Unrefuse     = 'unrefuse',
}


export const ESignOperationsList: Identifiable[] = [
  { uid: ESignOperationType.Sign,         name: 'Firmar' },
  { uid: ESignOperationType.Revoke,       name: 'Revocar firma' },
  { uid: ESignOperationType.Refuse,       name: 'Rechazar firmado' },
  { uid: ESignOperationType.Unrefuse,     name: 'Desrechazar firmado' },
  { uid: ESignOperationType.UpdateStatus, name: 'Cambiar estado' },
];