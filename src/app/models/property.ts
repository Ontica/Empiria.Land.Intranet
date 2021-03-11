/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Identifiable, Empty, DateString } from '@app/core';


export interface Property extends Identifiable {
  electronicID: string;
}


export interface RealEstate extends Property {
  cadastralID: string;
  cadastreLinkingDate: DateString;
  recorderOffice: Identifiable;
  municipality: Identifiable;
  resourceKind: Identifiable;
  lotSize: number;
  lotSizeUnit: Identifiable;
  description: string;
  metesAndBounds: string;
  // partitionOf?: Identifiable;
  // partitionType?: string;
  // partitionNo?: string;
  // mergedInto?: Identifiable;
}


export const EmptyRealEstate: RealEstate = {
  uid: '',
  name: '',
  electronicID: '',
  cadastralID: '',
  cadastreLinkingDate: '',
  recorderOffice: Empty,
  municipality: Empty,
  resourceKind: Empty,
  lotSize: null,
  lotSizeUnit: Empty,
  description: '',
  metesAndBounds: '',
};


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
