/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Assertion, HttpService, Identifiable } from '@app/core';

import { ManualBookEntryFields, InstrumentBookEntryFields, InstrumentFields, InstrumentRecording,
         RecordableSubjectFields, RecordingAct, RecordingActTypeGroup, RecordingBook, RegistrationCommand,
         RecordingActFields, RecordingActPartyFields, PartyFilter, Party, TractIndex } from '@app/models';


@Injectable()
export class RecordingDataService {

  constructor(private http: HttpService) { }


  getInstrumentRecording(instrumentRecordingUID: string): Observable<InstrumentRecording> {
    const path = `v5/land/registration/${instrumentRecordingUID}`;

    return this.http.get<InstrumentRecording>(path);
  }


  getRecordingAct(instrumentRecordingUID: string,
                  recordingActUID: string): Observable<RecordingAct> {
    Assertion.assertValue(instrumentRecordingUID, 'instrumentRecordingUID');
    Assertion.assertValue(recordingActUID, 'recordingActUID');

    const path = `v5/land/registration/${instrumentRecordingUID}/recording-acts/${recordingActUID}`;

    return this.http.get<RecordingAct>(path);
  }


  getRecordingActTypesList(listUID: string): Observable<Identifiable[]> {
    Assertion.assertValue(listUID, 'listUID');

    const path = `v5/land/registration/recording-act-types/${listUID}`;

    return this.http.get<Identifiable[]>(path);
  }


  getRecordingActTypesForInstrument(instrumentUID: string): Observable<RecordingActTypeGroup[]> {
    Assertion.assertValue(instrumentUID, 'instrumentUID');

    const path = `v5/land/registration/${instrumentUID}/recording-act-types`;

    return this.http.get<RecordingActTypeGroup[]>(path);
  }


  getRecordingActTypesForRecordableSubject(recordableSubjectUID: string): Observable<RecordingActTypeGroup[]> {
    Assertion.assertValue(recordableSubjectUID, 'recordableSubjectUID');

    const path = `v5/land/registration/recordable-subjects/${recordableSubjectUID}` +
      `/tract-index/recording-act-types`;

    return this.http.get<RecordingActTypeGroup[]>(path);
  }


  getRecordingActTypesForBookEntry(recordingBookUID: string,
                                   bookEntryUID: string): Observable<RecordingActTypeGroup[]> {
    Assertion.assertValue(recordingBookUID, 'recordingBookUID');
    Assertion.assertValue(bookEntryUID, 'bookEntryUID');

    const path = `v5/land/registration/recording-books/${recordingBookUID}` +
      `/book-entries/${bookEntryUID}/recording-act-types`;

    return this.http.get<RecordingActTypeGroup[]>(path);
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
                  manualBookEntryFields: ManualBookEntryFields): Observable<RecordingBook> {
    Assertion.assertValue(recordingBookUID, 'recordingBookUID');
    Assertion.assertValue(manualBookEntryFields, 'manualBookEntryFields');

    const path = `v5/land/registration/recording-books/${recordingBookUID}/book-entries`;

    return this.http.post<RecordingBook>(path, manualBookEntryFields);
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


  updateBookEntryInstrumentRecording(instrumentRecordingUID: string,
                                     bookEntryUID: string,
                                     instrument: ManualBookEntryFields): Observable<InstrumentRecording> {
    Assertion.assertValue(instrumentRecordingUID, 'instrumentRecordingUID');
    Assertion.assertValue(bookEntryUID, 'bookEntryUID');
    Assertion.assertValue(instrument, 'instrument');

    const path = `v5/land/registration/${instrumentRecordingUID}/book-entries/${bookEntryUID}` +
                 `/update-instrument`;

    return this.http.put<InstrumentRecording>(path, instrument);
  }


  appendRecordingAct(instrumentRecordingUID: string,
                     registrationCommand: RegistrationCommand): Observable<InstrumentRecording> {
    Assertion.assertValue(instrumentRecordingUID, 'instrumentRecordingUID');
    Assertion.assertValue(registrationCommand, 'registrationCommand');

    const path = `v5/land/registration/${instrumentRecordingUID}/recording-acts`;

    return this.http.post<InstrumentRecording>(path, registrationCommand);
  }


  updateRecordingAct(instrumentRecordingUID: string,
                     recordingActUID: string,
                     recordingActFields: RecordingActFields): Observable<RecordingAct> {
    Assertion.assertValue(instrumentRecordingUID, 'instrumentRecordingUID');
    Assertion.assertValue(recordingActUID, 'recordingActUID');
    Assertion.assertValue(recordingActFields, 'recordingActFields');

    const path = `v5/land/registration/${instrumentRecordingUID}/recording-acts/${recordingActUID}`;

    return this.http.put<RecordingAct>(path, recordingActFields);
  }


  removeRecordingAct(instrumentRecordingUID: string,
                     recordingActUID: string): Observable<InstrumentRecording> {
    Assertion.assertValue(instrumentRecordingUID, 'instrumentRecordingUID');
    Assertion.assertValue(recordingActUID, 'recordingActUID');

    const path = `v5/land/registration/${instrumentRecordingUID}/recording-acts/${recordingActUID}`;

    return this.http.delete<InstrumentRecording>(path);
  }


  appendRecordingActToBookEntry(recordingBookUID: string,
                                bookEntryUID: string,
                                registrationCommand: RegistrationCommand): Observable<InstrumentRecording> {
    Assertion.assertValue(recordingBookUID, 'recordingBookUID');
    Assertion.assertValue(bookEntryUID, 'bookEntryUID');
    Assertion.assertValue(registrationCommand, 'registrationCommand');

    const path = `v5/land/registration/recording-books/${recordingBookUID}` +
      `/book-entries/${bookEntryUID}/recording-acts`;

    return this.http.post<InstrumentRecording>(path, registrationCommand);
  }


  appendRecordingActParty(instrumentRecordingUID: string,
                          recordingActUID: string,
                          recordingActPartyFields: RecordingActPartyFields): Observable<RecordingAct> {
    Assertion.assertValue(instrumentRecordingUID, 'instrumentRecordingUID');
    Assertion.assertValue(recordingActUID, 'recordingActUID');
    Assertion.assertValue(recordingActPartyFields, 'recordingActPartyFields');

    const path = `v5/land/registration/${instrumentRecordingUID}/recording-acts/${recordingActUID}/parties`;

    return this.http.post<RecordingAct>(path, recordingActPartyFields);
  }


  removeRecordingActParty(instrumentRecordingUID: string,
                          recordingActUID: string,
                          recordingActPartyUID: string): Observable<RecordingAct> {
    Assertion.assertValue(instrumentRecordingUID, 'instrumentRecordingUID');
    Assertion.assertValue(recordingActUID, 'recordingActUID');
    Assertion.assertValue(recordingActPartyUID, 'recordingActPartyUID');

    const path = `v5/land/registration/${instrumentRecordingUID}/recording-acts/${recordingActUID}` +
      `/parties/${recordingActPartyUID}`;

    return this.http.delete<RecordingAct>(path);
  }


  searchParties(filter: PartyFilter): Observable<Party[]> {
    Assertion.assertValue(filter.instrumentRecordingUID, 'filter.instrumentRecordingUID');
    Assertion.assertValue(filter.recordingActUID, 'filter.recordingActUID');

    let path = `v5/land/registration/${filter.instrumentRecordingUID}/recording-acts/` +
      `${filter.recordingActUID}/parties`;

    if (filter.keywords) {
      path += `/?keywords=${filter.keywords}`;
    }

    return this.http.get<Party[]>(path);
  }


  removeRecordingActFromBookEntry(recordingBookUID: string,
                                  bookEntryUID: string,
                                  recordingActUID: string): Observable<InstrumentRecording> {
    Assertion.assertValue(recordingBookUID, 'recordingBookUID');
    Assertion.assertValue(bookEntryUID, 'bookEntryUID');
    Assertion.assertValue(recordingActUID, 'recordingActUID');

    const path = `v5/land/registration/recording-books/${recordingBookUID}/book-entries/${bookEntryUID}` +
      `/recording-acts/${recordingActUID}`;

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

    const path = `v5/land/registration/${instrumentRecordingUID}/recording-acts/` +
      `${recordingActUID}/update-recordable-subject`;

    return this.http.put<InstrumentRecording>(path, recordableSubjectFields);
  }


  openRegistration(instrumentRecordingUID: string): Observable<InstrumentRecording> {
    Assertion.assertValue(instrumentRecordingUID, 'instrumentRecordingUID');

    const path = `v5/land/registration/${instrumentRecordingUID}/open-registration`;

    return this.http.post<InstrumentRecording>(path);
  }


  closeRegistration(instrumentRecordingUID: string): Observable<InstrumentRecording> {
    Assertion.assertValue(instrumentRecordingUID, 'instrumentRecordingUID');

    const path = `v5/land/registration/${instrumentRecordingUID}/close-registration`;

    return this.http.post<InstrumentRecording>(path);
  }


  getTractIndex(instrumentRecordingUID: string, recordingActUID: string): Observable<TractIndex> {
    Assertion.assertValue(recordingActUID, 'recordingActUID');

    const path = `v5/land/registration/${instrumentRecordingUID}/` +
      `recording-acts/${recordingActUID}/tract-index`;

    return this.http.get<TractIndex>(path);
  }


  createRecordingActInTractIndex(recordableSubjectUID: string,
                                 command: RegistrationCommand): Observable<TractIndex> {
    Assertion.assertValue(recordableSubjectUID, 'recordableSubjectUID');
    Assertion.assertValue(command, 'command');

    const path = `v5/land/registration/recordable-subjects/${recordableSubjectUID}/tract-index`;

    return this.http.post<TractIndex>(path, command);
  }


  removeRecordingActFromTractIndex(recordableSubjectUID: string,
                                   recordingActUID: string): Observable<TractIndex> {
    Assertion.assertValue(recordableSubjectUID, 'recordableSubjectUID');
    Assertion.assertValue(recordingActUID, 'recordingActUID');

    const path = `v5/land/registration/recordable-subjects/${recordableSubjectUID}` +
      `/tract-index/${recordingActUID}`;

    return this.http.delete<TractIndex>(path);
  }


  openTractIndex(recordableSubjectUID: string): Observable<TractIndex> {
    Assertion.assertValue(recordableSubjectUID, 'recordableSubjectUID');

    const path = `v5/land/registration/recordable-subjects/${recordableSubjectUID}/tract-index/open`;

    return this.http.post<TractIndex>(path);
  }


  closeTractIndex(recordableSubjectUID: string): Observable<TractIndex> {
    Assertion.assertValue(recordableSubjectUID, 'recordableSubjectUID');

    const path = `v5/land/registration/recordable-subjects/${recordableSubjectUID}/tract-index/close`;

    return this.http.post<TractIndex>(path);
  }

}
