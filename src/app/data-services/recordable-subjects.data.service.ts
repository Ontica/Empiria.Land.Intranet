/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, DateStringLibrary, EmpObservable, HttpService, Identifiable } from '@app/core';

import { BookEntryShortModel, InstrumentType, Issuer, IssuersFilter, RecorderOffice, RecordingActSearchQuery,
         TractIndex } from '@app/models';


@Injectable()
export class RecordableSubjectsDataService {

  constructor(private http: HttpService) { }

  findInstrumentTypeIssuers(filter: IssuersFilter): EmpObservable<Issuer[]> {
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


  getAmendableRecordingActs(query: RecordingActSearchQuery): EmpObservable<TractIndex> {
    Assertion.assertValue(query.recordableSubjectUID, 'query.recordableSubjectUID');
    Assertion.assertValue(query.amendmentRecordingActTypeUID, 'query.amendmentRecordingActTypeUID');

    let path = `v5/land/registration/recordable-subjects/${query.recordableSubjectUID}/amendable-recording-acts/?`
      + `amendmentRecordingActTypeUID=${query.amendmentRecordingActTypeUID}`;

    if (!!query.authorizationDate && DateStringLibrary.isDate(query.authorizationDate)) {
      path += `&date=${query.authorizationDate}`;
    }

    if (!!query.instrumentRecordingUID) {
      path += `&instrumentRecordingUID=${query.instrumentRecordingUID}`;
    }

    return this.http.get<TractIndex>(path);
  }


  getAssociationKinds(): EmpObservable<string[]> {
    const path = `v5/land/registration/association-kinds`;

    return this.http.get<string[]>(path);
  }


  getNoPropertyKinds(): EmpObservable<string[]> {
    const path = `v5/land/registration/no-property-kinds`;

    return this.http.get<string[]>(path);
  }


  getInstrumentKinds(instrumentType: InstrumentType): EmpObservable<string[]> {
    Assertion.assertValue(instrumentType, 'instrumentType');

    const path = `v5/land/instrument-types/${instrumentType}/instrument-kinds`;

    return this.http.get<string[]>(path);
  }


  getRealEstateKinds(): EmpObservable<string[]> {
    const path = `v5/land/registration/real-estate-kinds`;

    return this.http.get<string[]>(path);
  }


  getRealEstatePartitionKinds(): EmpObservable<string[]> {
    const path = `v5/land/registration/real-estate-partition-kinds`;

    return this.http.get<string[]>(path);
  }


  getRealEstateLotSizeUnits(): EmpObservable<Identifiable[]> {
    const path = `v5/land/registration/real-estate-lot-size-units`;

    return this.http.get<Identifiable[]>(path);
  }


  getRecorderOffices(): EmpObservable<RecorderOffice[]> {
    const path = `v5/land/registration/recorder-offices`;

    return this.http.get<RecorderOffice[]>(path);
  }


  getRecordingBooks(recorderOfficeUID: string,
                    recordingSectionUID: string,
                    keywords?: string): EmpObservable<Identifiable[]> {
    let path = `v5/land/registration/recorder-offices/${recorderOfficeUID}/` +
               `recording-sections/${recordingSectionUID}/recording-books`;

    if (keywords) {
      path += `/?keywords=${keywords}`;
    }

    return this.http.get<Identifiable[]>(path);
  }


  getRecordingBookEntries(recordingBookUID: string): EmpObservable<BookEntryShortModel[]> {
    Assertion.assertValue(recordingBookUID, 'recordingBookUID');

    const path = `v5/land/registration/recording-books/${recordingBookUID}/book-entries`;

    return this.http.get<BookEntryShortModel[]>(path);
  }


  getFullTractIndex(recordableSubjectUID: string): EmpObservable<TractIndex> {
    Assertion.assertValue(recordableSubjectUID, 'recordableSubjectUID');

    const path = `v5/land/registration/recordable-subjects/${recordableSubjectUID}/tract-index`;

    return this.http.get<TractIndex>(path);
  }

}
