/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Identifiable, PartitionedType } from '@app/core';


export interface RecordableSubjectFields extends Identifiable, PartitionedType {
  electronicID?: string;
  kind?: string;
  notes?: string;
}


// tslint:disable-next-line: no-empty-interface
export interface AssociationFields extends RecordableSubjectFields {

}


// tslint:disable-next-line: no-empty-interface
export interface NoPropertyFields extends RecordableSubjectFields {

}


export interface RealEstateFields extends RecordableSubjectFields {
  districtUID?: string;
  municipalityUID?: string;
  cadastralID?: string;
  location?: string;
  lotSize?: number;
  lotSizeUnitUID?: string;
  description?: string;
  metesAndBounds?: string;
  partitionOfUID?: string;
  partitionType?: string;
  partitionNo?: string;
  mergedIntoUID?: string;
}


export const EmptyRecordableSubjectFields: RecordableSubjectFields = {
  uid: '',
  electronicID: '',
  name: '',
  type: '',
  kind: '',
  notes: ''
};


export const EmptyAssociationFields: AssociationFields = EmptyRecordableSubjectFields;


export const EmptyNoPropertyFields: NoPropertyFields = EmptyRecordableSubjectFields;


export const EmptyRealEstateFields: RealEstateFields = {
  uid: '',
  electronicID: '',
  name: '',
  type: '',
  kind: '',
  notes: '',
  districtUID: '',
  municipalityUID: '',
  cadastralID: '',
  location: '',
  lotSize: -1,
  lotSizeUnitUID: '',
  description: '',
  metesAndBounds: '',
  partitionOfUID: '',
  partitionType: '',
  partitionNo: '',
  mergedIntoUID: '',
};
