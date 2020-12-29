/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Entity } from '@app/core';


export interface Transaction extends Entity {
  type: string;
  subtype: string;
  transactionID: string;
  requestedBy: string;
  presentationTime: DateString;
  stage: string;
  status: string;
  statusName: string;
}

export type TransactionStages = 'Pending' | 'InProgress' | 'Completed' | 'Returned' | 'OnHold' | 'All';


export type TransactionStatus = 'OnSign';


export const EmptyTransaction: Transaction = {
  uid: '',
  type: '',
  subtype: '',
  transactionID: '',
  requestedBy: '',
  presentationTime: '',
  stage: '',
  status: '',
  statusName: ''
};


export interface TransactionFilter {
  stage?: TransactionStages;
  status?: TransactionStatus;
  keywords: string;
}


export const EmptyTransactionFilter: TransactionFilter = {
  stage: 'All',
  keywords: '',
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
