/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Assertion,  HttpService } from '@app/core';

import { Instrument, InstrumentFields,
         BookEntryFields, RecordingActTypeGroup } from '@app/models';


@Injectable()
export class InstrumentDataService {

  constructor(private http: HttpService) { }


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

  //
  // registration
  //
  // physical recording
  createNextPhysicalRecording(instrumentUID: string,
                              physicalRecording: BookEntryFields): Observable<Instrument> {
    Assertion.assertValue(instrumentUID, 'instrumentUID');
    Assertion.assertValue(physicalRecording, 'physicalRecording');

    const path = `v5/land/instruments/${instrumentUID}/create-next-physical-recording`;

    return this.http.post<Instrument>(path, physicalRecording);
  }


  deletePhysicalRecording(instrumentUID: string,
                          physicalRecordingUID: string): Observable<Instrument> {
    Assertion.assertValue(instrumentUID, 'instrumentUID');
    Assertion.assertValue(physicalRecordingUID, 'physicalRecordingUID');

    const path = `v5/land/instruments/${instrumentUID}/physical-recordings/${physicalRecordingUID}`;

    return this.http.delete<Instrument>(path);
  }


  //
  // recordable subjects
  //
  getRecordingActTypesForInstrument(instrumentUID: string): Observable<RecordingActTypeGroup[]> {
    Assertion.assertValue(instrumentUID, 'instrumentUID');

    const path = `v5/land/registration/${instrumentUID}/recording-act-types`;

    return this.http.get<RecordingActTypeGroup[]>(path);
  }

}
