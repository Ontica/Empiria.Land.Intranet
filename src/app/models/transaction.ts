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
  paymentOrder?: PaymentOrder;
  payment: PaymentFields;
  status: string;
  statusName: string;
  stage: string;
  actions: Action;
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


export interface PaymentFields {
  receiptNo: string;
  total: number;
  status?: string;
}


export interface PaymentOrder extends Entity {
  issueTime: DateString;
  dueDate: DateString;
  total: number;
  status: string;
  attributes: Attributes;
}


export interface Attributes {
  controlTag: string;
  url: string;
}


export interface Action {
  can: ActionCan;
  show: ActionShow;
}


export interface ActionCan {
  edit: boolean;
  delete: boolean;
  submit: boolean;
  editServices?: boolean;
  generatePaymentOrder?: boolean;
  cancelPaymentOrder?: boolean;
  editPayment?: boolean;
  cancelPayment?: boolean;
  uploadDocuments?: boolean;
  editInstrument?: boolean;
  editRecordingActs?: boolean;
  editCertificates?: boolean;
}


export interface ActionShow {
  serviceEditor?: boolean;
  paymentReceiptEditor?: boolean;
  uploadDocumentsTab?: boolean;
  instrumentRecordingTab?: boolean;
  certificatesEmissionTab?: boolean;
}


export const EmptyAction: Action = {
  can: {
    edit: false,
    delete: false,
    submit: false,
    editServices: false,
    generatePaymentOrder: false,
    cancelPaymentOrder: false,
    editPayment: false,
    cancelPayment: false,
    uploadDocuments: false,
    editInstrument: false,
    editRecordingActs: false,
    editCertificates: false,
  },
  show: {
    serviceEditor: false,
    paymentReceiptEditor: false,
    uploadDocumentsTab: false,
    instrumentRecordingTab: false,
    certificatesEmissionTab: false,
  }
};


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


export const EmptyPayment: PaymentFields  = {
  total: null,
  receiptNo: '',
  status: ''
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
  stage: '',
  actions: EmptyAction,
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


export interface ProvidedServiceType extends Identifiable {
  services: ProvidedService[];
}


export interface ProvidedService extends Identifiable {
  unit: Identifiable;
  feeConcepts: FeeConcept[];
}


export interface FeeConcept extends Entity {
  legalBasis: string;
  financialCode: string;
  requiresTaxableBase: boolean;
}

export const EmptyProvidedService: ProvidedService = {
  uid: 'empty',
  name: '',
  unit: Empty,
  feeConcepts: []
};

export const EmptyFeeConcept: FeeConcept = {
  uid: 'empty',
  legalBasis: '',
  financialCode: '',
  requiresTaxableBase: false
};

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
