/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Assertion, HttpService, Identifiable } from '@app/core';

import { CreateManualBookEntryFields, InstrumentBookEntryFields, InstrumentFields,
         InstrumentRecording, RecordableSubjectFields,
         RecordingBook, RegistrationCommand } from '@app/models';


@Injectable()
export class RecordingDataService {


  constructor(private http: HttpService) { }

  getInstrumentRecording(instrumentRecordingUID: string): Observable<InstrumentRecording> {
    const path = `v5/land/registration/${instrumentRecordingUID}`;

    return this.http.get<InstrumentRecording>(path);
  }


  getRecordingActTypesList(listUID: string): Observable<Identifiable[]> {
    Assertion.assertValue(listUID, 'listUID');

    const path = `v5/land/registration/recording-act-types/${listUID}`;

    return this.http.get<Identifiable[]>(path);
  }


  getTransactionInstrumentRecording(transactionUID: string): Observable<InstrumentRecording> {
    Assertion.assertValue(transactionUID, 'transactionUID');

    const path = `v5/land/transactions/${transactionUID}/instrument-recording`;

    return this.http.get<InstrumentRecording>(path);
  }


  getRecordingBook(recordingBookUID: string): Observable<RecordingBook> {
    Assertion.assertValue(recordingBookUID, 'recordingBookUID');

    const path = `v5/land/registration/recording-books/${recordingBookUID}`;

    return this.http.get<RecordingBook>(path);
  }


  createBookEntry(recordingBookUID: string,
                  fields: CreateManualBookEntryFields): Observable<RecordingBook> {
    Assertion.assertValue(recordingBookUID, 'recordingBookUID');
    Assertion.assertValue(fields, 'fields');

    const path = `v5/land/registration/recording-books/${recordingBookUID}/book-entries`;

    return this.http.post<RecordingBook>(path, fields);
  }


  deleteBookEntry(recordingBookUID: string, bookEntryUID: string): Observable<RecordingBook> {
    Assertion.assertValue(recordingBookUID, 'recordingBookUID');
    Assertion.assertValue(bookEntryUID, 'bookEntryUID');

    const path = `v5/land/registration/recording-books/${recordingBookUID}/book-entries/${bookEntryUID}`;

    return this.http.delete<RecordingBook>(path);
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
                               bookEntryFields: InstrumentBookEntryFields): Observable<InstrumentRecording> {
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


  updateRecordableSubject(instrumentRecordingUID: string,
                          recordingActUID: string,
                          recordableSubjectFields: RecordableSubjectFields): Observable<InstrumentRecording> {
    Assertion.assertValue(instrumentRecordingUID, 'instrumentRecordingUID');
    Assertion.assertValue(recordingActUID, 'recordingActUID');
    Assertion.assertValue(recordableSubjectFields, 'recordableSubjectFields');

    const path = `v5/land/registration/${instrumentRecordingUID}/recording-acts/${recordingActUID}/update-recordable-subject`;

    return this.http.put<InstrumentRecording>(path, recordableSubjectFields);
  }

}
