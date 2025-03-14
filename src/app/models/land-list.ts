/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Entity } from '@app/core';

import { TransactionStage, TransactionStatus } from './transaction';


export enum LandExplorerTypes {
  TRANSACTION       = 'TRANSACTION',
  ESIGN_TRANSACTION = 'ESIGN_TRANSACTION',
  ESIGN_DOCUMENT    = 'ESIGN_DOCUMENT',
}


export interface LandEntity extends Entity {
  uid: string;
  requestedBy: string;
  registrationTime: DateString;
  type: string;
  subtype: string;
  transactionID: string;
  presentationTime: DateString;
  internalControlNo: string;
  statusName: string;
  nextStatusName: string;
  assignedToName: string;
  nextAssignedToName: string;
}


export interface LandQuery {
  recorderOfficeUID: string;
  stage?: string;
  status?: string;
  keywords: string;
}


export const EmptyLandQuery: LandQuery = {
  recorderOfficeUID: '',
  stage: TransactionStage.All,
  status: TransactionStatus.All,
  keywords: '',
};
