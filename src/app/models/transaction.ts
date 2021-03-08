/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Assertion, DateString, Empty, Entity, Identifiable, MediaBase } from '@app/core';

import { RecorderOffice } from './registration';


export enum TransactionStage  {
  MyInbox = 'MyInbox',
  Pending = 'Pending',
  InProgress = 'InProgress',
  Completed = 'Completed',
  ControlDesk = 'ControlDesk',
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


export interface TransactionType extends Identifiable {
  subtypes?: TransactionSubtype[];
}


// tslint:disable-next-line: no-empty-interface
export interface TransactionSubtype extends Identifiable {

}


export interface RequestedService extends Entity {
  type: string;
  typeName: string;
  treasuryCode: string;
  legalBasis: string;
  taxableBase: number;
  unit: string;
  unitName: string;
  quantity: number;
  subtotal: number;
  notes: string;
}


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


// tslint:disable-next-line: no-empty-interface
export interface Agency extends Identifiable {

}


export interface PaymentFields {
  receiptNo: string;
  total: number;
  status?: string;
}


export const EmptyPayment: PaymentFields  = {
  total: null,
  receiptNo: '',
  status: ''
};


export interface PaymentOrder extends Entity {
  issueTime: DateString;
  dueDate: DateString;
  total: number;
  status: string;
  media: MediaBase;
}


export interface TransactionActions {
  can: {
    edit?: boolean;
    delete?: boolean;
    submit?: boolean;
    editServices?: boolean;
    generatePaymentOrder?: boolean;
    cancelPaymentOrder?: boolean;
    editPayment?: boolean;
    cancelPayment?: boolean;
    printSubmissionReceipt?: boolean;
    uploadDocuments?: boolean;
  };
  show: {
    serviceEditor?: boolean;
    paymentReceiptEditor?: boolean;
    preprocessingTab?: boolean;
    instrumentRecordingTab?: boolean;
    certificatesEmissionTab?: boolean;
  };
}


export const EmptyAction: TransactionActions = {
  can: {
    edit: false,
    delete: false,
    submit: false,
    editServices: false,
    generatePaymentOrder: false,
    cancelPaymentOrder: false,
    editPayment: false,
    cancelPayment: false,
    printSubmissionReceipt: false,
    uploadDocuments: false
  },
  show: {
    serviceEditor: false,
    paymentReceiptEditor: false,
    preprocessingTab: false,
    instrumentRecordingTab: false,
    certificatesEmissionTab: false,
  }
};


export interface TransactionShortModel extends Entity {
  type: string;
  subtype: string;
  transactionID: string;
  requestedBy: string;
  presentationTime: DateString;
  internalControlNo: string;
  statusName: string;
  assignedToName: string;
  nextStatusName: string;
  nextAssignedToName: string;
}


export const EmptyTransactionShortModel: TransactionShortModel = {
  uid: '',
  type: '',
  subtype: '',
  transactionID: '',
  requestedBy: '',
  presentationTime: '',
  internalControlNo: '',
  statusName: '',
  assignedToName: '',
  nextStatusName: '',
  nextAssignedToName: ''
};


export interface Transaction extends Entity {
  type: TransactionType;
  subtype: TransactionSubtype;
  transactionID: string;
  requestedBy: Requester;
  presentationTime: DateString;
  internalControlNo: string;
  agency: Agency;
  recorderOffice: RecorderOffice;
  instrumentDescriptor: string;
  requestedServices: RequestedService[];
  paymentOrder?: PaymentOrder;
  payment: PaymentFields;
  submissionReceipt?: MediaBase;
  statusName: string;
  assignedTo: Identifiable;
  nextStatusName: string;
  nextAssignedTo: Identifiable;
  actions: TransactionActions;
}


export const EmptyTransaction: Transaction = {
  uid: '',
  type: Empty,
  subtype: Empty,
  transactionID: '',
  requestedBy: EmptyRequester,
  presentationTime: '',
  internalControlNo: '',
  agency: Empty,
  recorderOffice: Empty,
  instrumentDescriptor: '',
  requestedServices: [],
  payment: EmptyPayment,
  statusName: '',
  assignedTo: Empty,
  nextStatusName: '',
  nextAssignedTo: Empty,
  actions: EmptyAction
};


export interface ProvidedServiceType extends Identifiable {
  services: ProvidedService[];
}


export interface ProvidedService extends Identifiable {
  unit: Identifiable;
  feeConcepts: FeeConcept[];
}

export const EmptyProvidedService: ProvidedService = {
  uid: 'empty',
  name: '',
  unit: Empty,
  feeConcepts: []
};


export interface FeeConcept extends Entity {
  legalBasis: string;
  financialCode: string;
  requiresTaxableBase: boolean;
}

export const EmptyFeeConcept: FeeConcept = {
  uid: 'empty',
  legalBasis: '',
  financialCode: '',
  requiresTaxableBase: false
};


export interface TransactionFields {
  typeUID?: string;
  subtypeUID?: string;
  recorderOfficeUID?: string;
  agencyUID?: string;
  requestedBy?: string;
  requestedByEmail?: string;
  instrumentDescriptor?: string;
}


export interface RequestedServiceFields {
  serviceUID: string;
  feeConceptUID: string;
  unitUID: string;
  taxableBase: number;
  quantity: number;
  notes: string;
}


// Functions

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
    case 'Transactions.ControlDesk':
      return TransactionStage.ControlDesk;
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
    internalControlNo: transaction.internalControlNo,
    statusName: transaction.statusName,
    assignedToName: transaction.assignedTo.name,
    nextStatusName: transaction.nextStatusName,
    nextAssignedToName: transaction.nextAssignedTo.name
  };
}
