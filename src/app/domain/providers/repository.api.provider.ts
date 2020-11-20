/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Observable } from 'rxjs';

import { RealEstate } from '@app/domain/entities';
import { Identifiable } from '@app/core';


export abstract class RepositoryApiProvider {

  abstract getOwnershipRecordingSectionList(uid: string): Observable<Identifiable[]>;

  abstract getRealEstate(uid: string): Observable<RealEstate>;

  abstract getRealEstateTypeList(): Observable<Identifiable[]>;

  abstract getRecorderOfficeList(): Observable<Identifiable[]>;

  abstract getRecorderOfficeMunicipalityList(recorderOfficeUID: string): Observable<Identifiable[]>;

  abstract getRecorderOfficeSectionBookList(recorderOfficeUID: string,
                                            sectionUID: string): Observable<Identifiable[]>;

}
