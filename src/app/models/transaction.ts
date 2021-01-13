/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Assertion, DateString, Empty, Entity, Identifiable } from '@app/core';
import { Instrument } from './instrument';


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


export interface Transaction extends Entity {
  type: TransactionType;
  subtype: TransactionSubtype;
  transactionID: string;
  presentationTime: DateString;
  requestedBy: Requester;
  assignedTo: Identifiable;
  agency: Agency;
  recorderOffice: RecorderOffice;
  instrument?: Instrument;
  instrumentDescriptor: string;
  baseResource: Resource;
  requestedServices: RequestedService[];
  payment: Payment;
  status: string;
  statusName: string;
  stage: string;
}


export interface RequestedService extends Entity {
  type: string;
  typeName: string;
  treasuryCode: string;
}


export interface TransactionType extends Identifiable {
  subtypes?: TransactionSubtype[];
}


export interface TransactionSubtype extends Identifiable {

}


export interface Requester {
  name: string;
  email?: string;
  phone?: string;
  rfc?: string;
}


export interface Agency extends Identifiable {

}


export interface RecorderOffice extends Identifiable {

}



export interface Resource extends Entity {
  type: string;
  subtype: string;
  resourceID: string;
  mediaUri: string;
}


export interface Payment {
  total: number;
  receiptNo: string;
  mediaUri: string;
}


export const EmptyRequester: Requester = {
  name: '',
  email: '',
  phone: '',
  rfc: ''
};


export const EmptyResource: Resource = {
  uid: '',
  type: '',
  subtype: '',
  resourceID: '',
  mediaUri: ''
};


export const EmptyPayment: Payment = {
  total: null,
  receiptNo: '',
  mediaUri: ''
};


export const EmptyTransaction: Transaction = {
  uid: '',
  type: Empty,
  subtype: Empty,
  transactionID: '',
  presentationTime: '',
  requestedBy: EmptyRequester,
  assignedTo: Empty,
  agency: Empty,
  recorderOffice: Empty,
  instrumentDescriptor: '',
  baseResource: EmptyResource,
  requestedServices: [],
  payment: EmptyPayment,
  status: '',
  statusName: '',
  stage: ''
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


export interface ModificationTransaction {
  typeUID?: string;
  subtypeUID?: string;
  recorderOfficeUID?: string;
  agencyUID?: string;
  requestedBy?: string;
  requestedByEmail?: string;
  instrumentDescriptor?: string;
}


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


export function mapTransactionShortModelFromTransaction(transaction: Transaction): TransactionShortModel {
  return {
    uid: transaction.uid,
    type: transaction.type.name,
    subtype: transaction.subtype.name,
    transactionID: transaction.transactionID,
    requestedBy: transaction.requestedBy.name,
    presentationTime: transaction.presentationTime,
    stage: transaction.stage,
    status: transaction.status,
    statusName: transaction.statusName,
    assignedToUID: transaction.assignedTo?.uid,
    assignedToName: transaction.assignedTo?.name
  };
}

// Array Functions

export function insertToArrayIfNotExist<T, K extends keyof T>(array: T[], item: T, key: K): T[] {
  let newArray = [... array];
  if (array.filter(element => element[key] === item[key]).length === 0) {
    newArray = [...array, ... [item]];
  }
  return newArray;
}


export function insertItemTopArray<T, K extends keyof T>(array: T[], item: T, key: K): T[] {
  const oldArrayFilter = array.filter(element => element[key] !== item[key]);
  const newArray = [... [item], ...oldArrayFilter];
  return newArray;
}
