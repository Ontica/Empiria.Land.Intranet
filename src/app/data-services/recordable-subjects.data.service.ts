/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Assertion, DateStringLibrary, HttpService, Identifiable } from '@app/core';

import { InstrumentType, Issuer, IssuersFilter,
         RecorderOffice, RecordingActTypeGroup } from '@app/models';


@Injectable()
export class RecordableSubjectsDataService {

  constructor(private http: HttpService) { }

  findInstrumentTypeIssuers(filter: IssuersFilter): Observable<Issuer[]> {
    let path = `v5/land/instrument-issuers/?instrumentType=${filter.instrumentType}`;

    if (filter.instrumentKind) {
      path += `&instrumentKind="${filter.instrumentKind}"`;
    }

    if (filter.onDate && DateStringLibrary.isDate(filter.onDate)) {
      path += `&onDate=${filter.onDate}`;
    }

    if (filter.keywords) {
      path += `&keywords=${filter.keywords}`;
    }

    return this.http.get<Issuer[]>(path);
  }


  getAssociationKinds(): Observable<string[]> {
    const path = `v5/land/registration/association-kinds`;

    return this.http.get<string[]>(path);
  }


  getNoPropertyKinds(): Observable<string[]> {
    const path = `v5/land/registration/no-property-kinds`;

    return this.http.get<string[]>(path);
  }


  getInstrumentKinds(instrumentType: InstrumentType): Observable<string[]> {
    Assertion.assertValue(instrumentType, 'instrumentType');

    const path = `v5/land/instrument-types/${instrumentType}/instrument-kinds`;

    return this.http.get<string[]>(path);
  }


  getRealEstateKinds(): Observable<string[]> {
    const path = `v5/land/registration/real-estate-kinds`;

    return this.http.get<string[]>(path);
  }


  getRealEstateLotSizeUnits(): Observable<Identifiable[]> {
    const path = `v5/land/registration/real-estate-lot-size-units`;

    return this.http.get<Identifiable[]>(path);
  }


  getRecorderOffices(): Observable<RecorderOffice[]> {
    const path = `v5/land/registration/recorder-offices`;

    return this.http.get<RecorderOffice[]>(path);
  }


  getRecordingActTypesForInstrument(instrumentUID: string): Observable<RecordingActTypeGroup[]> {
    Assertion.assertValue(instrumentUID, 'instrumentUID');

    const path = `v5/land/registration/${instrumentUID}/recording-act-types`;

    return this.http.get<RecordingActTypeGroup[]>(path);
  }

}
