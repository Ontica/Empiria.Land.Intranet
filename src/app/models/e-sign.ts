/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Identifiable } from '@app/core';

import { LandEntity, LandExplorerTypes, LandQuery } from './land-list';


export const ESignLandExplorerTypesList: Identifiable[] = [
  { uid: LandExplorerTypes.ESIGN_TRANSACTION, name: 'Trámites' },
  { uid: LandExplorerTypes.ESIGN_DOCUMENT,    name: 'Documentos' },
];


export enum ESignStatus {
  Unsigned = 'Unsigned',
  Signed   = 'Signed',
  Refused  = 'Refused',
  Revoked  = 'Revoked',
}


export const ESignStatusList: Identifiable[] = [
  { uid: ESignStatus.Unsigned, name: 'Por firmar' },
  { uid: ESignStatus.Signed,   name: 'Firmados' },
  // { uid: ESignStatus.Refused,  name: 'Rechazados' },
  { uid: ESignStatus.Revoked,  name: 'Revocados' },
];


export interface ESignRequestsQuery extends LandQuery {
  recorderOfficeUID: string;
  status: ESignStatus;
  keywords: string;
}


export const EmptyESignRequestsQuery: ESignRequestsQuery = {
  recorderOfficeUID: '',
  status: ESignStatus.Unsigned,
  keywords: '',
};


export enum ESignOperationType {
  UpdateStatus = 'update-status',
  Sign         = 'Sign',
  Revoke       = 'Revoke',
  Refuse       = 'Refuse',
  Unrefuse     = 'Unrefuse',
};


export interface SignableDocumentDescriptor extends LandEntity {
  documentID: string;
}


export const ESignOperationsList: Identifiable[] = [
  { uid: ESignOperationType.Sign,         name: 'Firmar' },
  { uid: ESignOperationType.Revoke,       name: 'Revocar firma' },
  { uid: ESignOperationType.Refuse,       name: 'Rechazar firmado' },
  { uid: ESignOperationType.Unrefuse,     name: 'Desrechazar firmado' },
  { uid: ESignOperationType.UpdateStatus, name: 'Cambiar estado' },
];


export function buildESignDocumentsOperationsListByStatus(status: ESignStatus): Identifiable[] {
  switch (status) {
    case ESignStatus.Signed: return [{ uid: ESignOperationType.Revoke, name: 'Revocar firma' }];
    case ESignStatus.Refused: return [];
    case ESignStatus.Unsigned:
    case ESignStatus.Revoked:
    default: return [{ uid: ESignOperationType.Sign, name: 'Firmar' }];
  }
}


export function buildESignTransactionsOperationsListByStatus(status: ESignStatus): Identifiable[] {
  switch (status) {
    case ESignStatus.Unsigned:

      return [
        { uid: ESignOperationType.Sign,         name: 'Firmar' },
   //     { uid: ESignOperationType.Refuse,       name: 'Rechazar firmado' },
        { uid: ESignOperationType.UpdateStatus, name: 'Cambiar estado' },
      ];

    case ESignStatus.Signed:

      return [
        { uid: ESignOperationType.Revoke,       name: 'Revocar firma' },
        { uid: ESignOperationType.UpdateStatus, name: 'Cambiar estado' },
      ];

    case ESignStatus.Refused:

      return [
        // { uid: ESignOperationType.Unrefuse,     name: 'Desrechazar firmado' },
        // { uid: ESignOperationType.UpdateStatus, name: 'Cambiar estado' },
      ];

    case ESignStatus.Revoked:
    default:
      return [
        { uid: ESignOperationType.Sign,         name: 'Firmar' },
        { uid: ESignOperationType.UpdateStatus, name: 'Cambiar estado' },
      ];
  }
}


export interface ESignCredentials {
  userID: string;
  password: string;
}


export interface ESignTransactionCommand {
  commandType: ESignOperationType;
  credentials: ESignCredentials;
  transactionUIDs: string[];
}


export interface ESignDocumentCommand {
  commandType: ESignOperationType;
  credentials: ESignCredentials;
  documentUIDs: string[];
}
