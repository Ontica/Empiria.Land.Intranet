/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Assertion, DateStringLibrary, HttpService } from '@app/core';

import { Instrument, Issuer, IssuersFilter, InstrumentFields,
         PhysicalRecordingFields, RecordingActTypeGroup } from '@app/models';


@Injectable()
export class InstrumentDataService {

  constructor(private http: HttpService) { }

  findIssuers(filter: IssuersFilter): Observable<Issuer[]> {
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


  getTransactionInstrument(transactionUID: string): Observable<Instrument> {
    Assertion.assertValue(transactionUID, 'transactionUID');

    const path = `v5/land/transactions/${transactionUID}/instrument`;

    return this.http.get<Instrument>(path);
  }


  createTransactionInstrument(transactionUID: string,
                              instrument: InstrumentFields): Observable<Instrument> {
    Assertion.assertValue(transactionUID, 'transactionUID');
    Assertion.assertValue(instrument, 'instrument');

    const path = `v5/land/transactions/${transactionUID}/instrument`;

    return this.http.post<Instrument>(path, instrument);
  }


  updateTransactionInstrument(transactionUID: string,
                              instrument: InstrumentFields): Observable<Instrument> {
    Assertion.assertValue(transactionUID, 'transactionUID');
    Assertion.assertValue(instrument, 'instrument');

    const path = `v5/land/transactions/${transactionUID}/instrument`;

    return this.http.patch<Instrument>(path, instrument);
  }


  createNextPhysicalRecording(instrumentUID: string,
                              physicalRecording: PhysicalRecordingFields): Observable<Instrument> {
    Assertion.assertValue(instrumentUID, 'instrumentUID');
    Assertion.assertValue(physicalRecording, 'physicalRecording');

    const path = `v5/land/instruments/${instrumentUID}/create-next-physical-recording`;

    return this.http.post<Instrument>(path, physicalRecording);
  }


  deletePhysicalRecording(instrumentUID: string,
                          physicialRecordingUID: string): Observable<Instrument> {
    Assertion.assertValue(instrumentUID, 'instrumentUID');
    Assertion.assertValue(physicialRecordingUID, 'physicialRecordingUID');

    const path = `v5/land/instruments/${instrumentUID}/physical-recordings/${physicialRecordingUID}`;

    return this.http.delete<Instrument>(path);
  }


  getRecordingActTypesForInstrument(instrumentUID: string): Observable<RecordingActTypeGroup[]> {
    Assertion.assertValue(instrumentUID, 'instrumentUID');

    const path = `v5/land/registration/${instrumentUID}/recording-act-types`;

    return this.http.get<RecordingActTypeGroup[]>(path);
  }

}
