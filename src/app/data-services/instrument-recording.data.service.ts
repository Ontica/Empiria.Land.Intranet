/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Assertion, HttpService } from '@app/core';

import { InstrumentFields, InstrumentRecording } from '@app/models';


@Injectable()
export class InstrumentRecordingDataService {

  constructor(private http: HttpService) { }


  getTransactionInstrumentRecording(transactionUID: string): Observable<InstrumentRecording> {
    Assertion.assertValue(transactionUID, 'transactionUID');

    const path = `v5/land/transactions/${transactionUID}/instrument-recording`;

    return this.http.get<InstrumentRecording>(path);
  }


  createTransactionInstrumentRecording(transactionUID: string,
                                       instrument: InstrumentFields): Observable<InstrumentRecording> {
    Assertion.assertValue(transactionUID, 'transactionUID');
    Assertion.assertValue(instrument, 'instrument');

    const path = `v5/land/transactions/${transactionUID}/instrument-recording`;

    return this.http.post<InstrumentRecording>(path, instrument);
  }


  updateTransactionInstrumentRecording(transactionUID: string,
                                       instrument: InstrumentFields): Observable<InstrumentRecording> {
    Assertion.assertValue(transactionUID, 'transactionUID');
    Assertion.assertValue(instrument, 'instrument');

    const path = `v5/land/transactions/${transactionUID}/instrument-recording`;

    return this.http.patch<InstrumentRecording>(path, instrument);
  }

}
