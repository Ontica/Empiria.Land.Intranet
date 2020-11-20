/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Entity, PartitionedType } from '@app/core';

import { RealEstate } from './property';


export interface Transaction extends Entity {
  status: string;
  presentationDate: DateString;
}


export type FilingRequestStatusType = 'Pending' | 'OnSign' | 'OnPayment' | 'Submitted' |
                                      'Finished' | 'Rejected' | 'All';


export interface FilingRequestStatus {
  type: FilingRequestStatusType;
  name: string;
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


export interface Preparer {
  agency: string;
  agent: string;
}


export interface PaymentOrderData {
  urlPath: string;
  routeNumber: string;
  dueDate: DateString;
  total: number;
  receiptNo?: string;
}

export type ProcedureType = 'AvisoPreventivo' | 'AvisoTestamentario' | 'SegundoAvisoDefinitivo' |
                            'InscripcionEscrituraPublica' | 'SolicitudFolioReal' | 'NoDeterminado';


export type ApplicationFormType = ProcedureType;


export type ApplicationFormFields = AvisoTestamentario | PreventiveNote |
                                    DefinitiveNote | FolioRealRequest |
                                    NotarialInstrument;


export interface ApplicationForm extends Entity {
  type: ApplicationFormType;
  typeName: string;
  filledOutBy: string;
  filledOutTime: DateString;
  fields: ApplicationFormFields;
}


export interface ESignData {
  hash: string;
  seal: string;
  sign: string;
}


export interface Documentation {
  status: 'NotAllowed' | 'Optional' | 'Required' | 'Completed';
}


export interface EFilingDocument extends Entity {
  type: string;
  typeName: string;
  name: string;
  contentType: string;
  uri: string;
  status: 'protected' | 'readonly' | 'editable' | 'signed' |
          'submitted' | 'verified' | 'returned' | 'rejected';
}


export interface EFilingRequest extends Entity {
  procedureType: ProcedureType;
  requestedBy: Requester;
  preparer: Preparer;
  summary: string;
  lastUpdateTime: DateString;
  status: FilingRequestStatus;
  documentation: Documentation;
  form?: ApplicationForm;
  paymentOrder?: PaymentOrderData;
  esign?: ESignData;
  transaction?: Transaction;
  outputDocuments: EFilingDocument[];
  permissions: FilingRequestPermissions;
}


export interface RecordingSeekData {
  districtUID: string;
  municipalityUID: string;
  recordingSectionUID: string;
  recordingBookUID: string;
  recordingNo: string;
  recordingFraction?: string;
  ownership?: string;
  cadastralKey?: string;
  propertyType?: string;
  propertyName?: string;
  location?: string;
  searchNotes?: string;
}


export interface RealPropertyData {
  propertyUID?: string;
  recordingSeekData?: RecordingSeekData;
}


export interface PreventiveNote {
  propertyData: RealPropertyData;
  projectedOperation: string;
  grantors: string;
  grantees: string;
  createPartition?: boolean;
  partitionName?: string;
  observations?: string;
}


export const EmptyPreventiveNote: PreventiveNote = {
  propertyData: {},
  projectedOperation: '',
  grantors: '',
  grantees: ''
};


export interface DefinitiveNote {
  propertyData: RealPropertyData;
  operation: string;
  grantors: string;
  grantees: string;
  observations?: string;
}


export const EmptyDefinitiveNote: DefinitiveNote = {
  propertyData: {},
  operation: '',
  grantors: '',
  grantees: ''
};


export interface AvisoTestamentario {
  text: string;
  observations?: string;
}


export const EmptyAvisoTestamentario: AvisoTestamentario = {
  text: ''
};


export interface FolioRealRequest {
  antecedent: string;
  propertyDescription: string;
  observations?: string;
}


export const EmptyFolioRealRequest: FolioRealRequest = {
  antecedent: '',
  propertyDescription: ''
};


export interface NotarialInstrument {
  property: RealEstate;
}


export const EmptyTransaction: Transaction = {
  uid: '',
  status: '',
  presentationDate: ''
};


export const EmptyEFilingRequest: EFilingRequest = {
  uid: '',
  procedureType: 'NoDeterminado',
  requestedBy: {
    name: '',
    email: '',
    phone: '',
    rfc: ''
  },
  preparer: {
    agency: '',
    agent: '',
  },
  summary: '',
  documentation: null,
  form: null,
  lastUpdateTime: '',
  status: {
    type: 'Pending',
    name: 'Pendiente'
  },
  esign: null,
  transaction: EmptyTransaction,
  outputDocuments: [],
  permissions: {
    canManage: false,
    canRegister: false,
    canSendToSign: false,
    canSign: false
  }
};


export interface EFilingRequestFilter {
  status: FilingRequestStatusType;
  keywords: string;
}


export const EmptyEFilingRequestFilter: EFilingRequestFilter = {
  status: 'All',
  keywords: '',
};


export interface FilingRequestPermissions {
  canManage: boolean;
  canRegister: boolean;
  canSendToSign: boolean;
  canSign: boolean;
}
