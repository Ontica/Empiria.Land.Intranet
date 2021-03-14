/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Assertion, HttpService } from '@app/core';

import { BookEntryFields, InstrumentRecording } from '@app/models';


@Injectable()
export class RecordingBooksDataService {

  constructor(private http: HttpService) { }


  createNextBookEntry(instrumentRecordingUID: string,
                      bookEntryFields: BookEntryFields): Observable<InstrumentRecording> {
    Assertion.assertValue(instrumentRecordingUID, 'instrumentRecordingUID');
    Assertion.assertValue(bookEntryFields, 'bookEntryFields');

    const path = `v5/land/registration/${instrumentRecordingUID}/book-entries/create-next-book-entry`;

    return this.http.post<InstrumentRecording>(path, bookEntryFields);
  }


  deleteBookEntry(instrumentRecordingUID: string,
                  bookEntryUID: string): Observable<InstrumentRecording> {
    Assertion.assertValue(instrumentRecordingUID, 'instrumentRecordingUID');
    Assertion.assertValue(bookEntryUID, 'bookEntryUID');

    const path = `v5/land/registration/${instrumentRecordingUID}/book-entries/${bookEntryUID}`;

    return this.http.delete<InstrumentRecording>(path);
  }

}
