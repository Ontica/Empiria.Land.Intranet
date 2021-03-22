/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Assertion, HttpService, Identifiable } from '@app/core';

import { BookEntryFields, InstrumentFields, InstrumentRecording, RegistrationCommand } from '@app/models';


@Injectable()
export class RecordingDataService {

  constructor(private http: HttpService) { }


  getRecordingActsList(listUID: string): Observable<Identifiable[]> {
    Assertion.assertValue(listUID, 'listUID');

    const path = `v5/land/registration/recording-acts/${listUID}`;

    return this.http.get<Identifiable[]>(path);
  }


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


  createRecordingAct(instrumentRecordingUID: string,
                     registrationCommand: RegistrationCommand): Observable<InstrumentRecording> {
    Assertion.assertValue(instrumentRecordingUID, 'instrumentRecordingUID');
    Assertion.assertValue(registrationCommand, 'registrationCommand');

    const path = `v5/land/registration/${instrumentRecordingUID}/recording-acts`;

    return this.http.post<InstrumentRecording>(path, registrationCommand);
  }


  deleteRecordingAct(instrumentRecordingUID: string,
                     recordingActUID: string): Observable<InstrumentRecording> {
    Assertion.assertValue(instrumentRecordingUID, 'instrumentRecordingUID');
    Assertion.assertValue(recordingActUID, 'recordingActUID');

    const path = `v5/land/registration/${instrumentRecordingUID}/recording-acts/${recordingActUID}`;

    return this.http.delete<InstrumentRecording>(path);
  }


  createNextRecordingBookEntry(instrumentRecordingUID: string,
                               bookEntryFields: BookEntryFields): Observable<InstrumentRecording> {
    Assertion.assertValue(instrumentRecordingUID, 'instrumentRecordingUID');
    Assertion.assertValue(bookEntryFields, 'bookEntryFields');

    const path = `v5/land/registration/${instrumentRecordingUID}/book-entries/create-next-book-entry`;

    return this.http.post<InstrumentRecording>(path, bookEntryFields);
  }


  deleteRecordingBookEntry(instrumentRecordingUID: string,
                           bookEntryUID: string): Observable<InstrumentRecording> {
    Assertion.assertValue(instrumentRecordingUID, 'instrumentRecordingUID');
    Assertion.assertValue(bookEntryUID, 'bookEntryUID');

    const path = `v5/land/registration/${instrumentRecordingUID}/book-entries/${bookEntryUID}`;

    return this.http.delete<InstrumentRecording>(path);
  }

}
