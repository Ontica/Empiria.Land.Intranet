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
  agency: Agency;
  recorderOffice: RecorderOffice;
  instrument?: Instrument;
  instrumentDescriptor: string;
  baseResource: Resource;
  services: any[];
  payment: Payment;
  status: string;
  statusName: string;
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
  agency: Empty,
  recorderOffice: Empty,
  instrumentDescriptor: '',
  baseResource: EmptyResource,
  services: [],
  payment: EmptyPayment,
  status: '',
  statusName: ''
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


export const TransactionTypesList: any[] = [
  { type: 'AvisoPreventivo', typeName: 'Avisos Preventivos o definitivo' },
  { type: 'InscripcionDocumento', typeName: 'Inscripción de documentos' },
  { type: 'ExpedicionCertificado', typeName: 'Expedición de certificados' },
  { type: 'Procede', typeName: 'Procede' },
  { type: 'TramiteComercio', typeName: 'Trámite de comercio' },
  { type: 'ArchivoGeneralNotaria', typeName: 'Archivo general de notarías' },
  { type: 'OficialiaPartes', typeName: 'Oficialía de partes' }
];


export enum TransactionTypeEnum {
  AvisoPreventivo = 'AvisoPreventivo',
  InscripcionDocumento = 'InscripcionDocumento',
  ExpedicionCertificado = 'ExpedicionCertificado',
  Procede = 'Procede',
  TramiteComercio = 'TramiteComercio',
  ArchivoGeneralNotaria = 'ArchivoGeneralNotaria',
  OficialiaPartes = 'OficialiaPartes'
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
