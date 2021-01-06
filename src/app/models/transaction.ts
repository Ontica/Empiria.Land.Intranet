/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Assertion, DateString, Entity } from '@app/core';


export interface TransactionShortModel extends Entity {
  type: string;
  subtype: string;
  transactionID: string;
  requestedBy: string;
  presentationTime: DateString;
  stage: string;
  status: string;
  statusName: string;
  assignedToUID: string;
  assignedToName: string;
}


export const EmptyTransactionShortModel: TransactionShortModel = {
  uid: '',
  type: '',
  subtype: '',
  transactionID: '',
  requestedBy: '',
  presentationTime: '',
  stage: '',
  status: '',
  statusName: '',
  assignedToUID: '',
  assignedToName: ''
};


export interface Requester {
  name: string;
  email?: string;
  phone?: string;
  rfc?: string;
}


export const EmptyRequester: Requester = {
  name: '',
  email: '',
  phone: '',
  rfc: ''
};


export enum TransactionStage  {
  MyInbox = 'MyInbox',
  Pending = 'Pending',
  InProgress = 'InProgress',
  Completed = 'Completed',
  Returned = 'Returned',
  OnHold = 'OnHold',
  All = 'All'
}


export enum TransactionStatus {
  OnSign = 'OnSign',
  All = ''
}


export interface TransactionFilter {
  stage?: TransactionStage;
  status?: TransactionStatus;
  keywords: string;
}


export const EmptyTransactionFilter: TransactionFilter = {
  stage: TransactionStage.All,
  status: TransactionStatus.All,
  keywords: '',
};


export function mapTransactionStageFromViewName(viewName: string): TransactionStage {
  switch (viewName) {
    case 'Transactions.MyInbox':
      return TransactionStage.MyInbox;
    case 'Transactions.InProgress':
      return TransactionStage.InProgress;
    case 'Transactions.OnSign':
      return TransactionStage.InProgress;
    case 'Transactions.Finished':
      return TransactionStage.Completed;
    case 'Transactions.Returned':
      return TransactionStage.Returned;
    case 'Transactions.Pending':
      return TransactionStage.Pending;
    case 'Transactions.All':
      return TransactionStage.All;
    default:
      throw Assertion.assertNoReachThisCode(`Unhandled transaction stage for view '${viewName}'.`);
  }
}


export function mapTransactionStatusFromViewName(viewName: string): TransactionStatus {
  if (viewName === 'Transactions.OnSign') {
    return TransactionStatus.OnSign;
  }
  return TransactionStatus.All;
}
