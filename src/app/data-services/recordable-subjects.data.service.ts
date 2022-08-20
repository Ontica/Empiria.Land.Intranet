/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Assertion, DateStringLibrary, HttpService, Identifiable } from '@app/core';

import { BookEntryShortModel, InstrumentType, Issuer, IssuersFilter, RecordableSubjectFilter,
         RecordableSubjectShortModel, RecorderOffice, TractIndex } from '@app/models';


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


  getAmendableRecordingActs(recordableSubjectUID: string,
                            instrumentRecordingUID: string,
                            amendmentRecordingActTypeUID: string): Observable<TractIndex> {
    const path = `v5/land/registration/recordable-subjects/${recordableSubjectUID}`
      + `/amendable-recording-acts/?instrumentRecordingUID=${instrumentRecordingUID}`
      + `&amendmentRecordingActTypeUID=${amendmentRecordingActTypeUID}`;

    return this.http.get<TractIndex>(path);
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


  getRealEstatePartitionKinds(): Observable<string[]> {
    const path = `v5/land/registration/real-estate-partition-kinds`;

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


  getRecordingBooks(recorderOfficeUID: string,
                    recordingSectionUID: string,
                    keywords?: string): Observable<Identifiable[]> {
    let path = `v5/land/registration/recorder-offices/${recorderOfficeUID}/` +
               `recording-sections/${recordingSectionUID}/recording-books`;

    if (keywords) {
      path += `/?keywords=${keywords}`;
    }

    return this.http.get<Identifiable[]>(path);
  }


  getRecordingBookEntries(recordingBookUID: string): Observable<BookEntryShortModel[]> {
    Assertion.assertValue(recordingBookUID, 'recordingBookUID');

    const path = `v5/land/registration/recording-books/${recordingBookUID}/book-entries`;

    return this.http.get<BookEntryShortModel[]>(path);
  }


  searchRecordableSubject(filter: RecordableSubjectFilter): Observable<RecordableSubjectShortModel[]> {
    let path = `v5/land/registration/recordable-subjects`;

    if (filter.type) {
      path += `/?type=${filter.type}`;
    }

    if (filter.keywords) {
      path += filter.type ? '&' : '/?';
      path += `keywords=${filter.keywords}`;
    }

    return this.http.get<RecordableSubjectShortModel[]>(path);
  }


  getFullTractIndex(recordableSubjectUID: string): Observable<TractIndex> {
    Assertion.assertValue(recordableSubjectUID, 'recordableSubjectUID');

    const path = `v5/land/registration/recordable-subjects/${recordableSubjectUID}/tract-index`;

    return this.http.get<TractIndex>(path);
  }

}
