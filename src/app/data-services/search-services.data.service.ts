/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Assertion, HttpService } from '@app/core';

import { PartyRecordSearchQuery, RecordableSubjectQueryResult, RecordingActPartyQueryResult,
         RecordSearchQuery } from '@app/models';


@Injectable()
export class SearchServicesDataService {

  constructor(private http: HttpService) { }


  searchRecordableSubject(query: RecordSearchQuery): Observable<RecordableSubjectQueryResult[]> {
    Assertion.assertValue(query, 'query');

    const path = `v5/land/internal-search-services/recordable-subjects`;

    return this.http.post<RecordableSubjectQueryResult[]>(path, query);
  }


  searchParties(query: PartyRecordSearchQuery): Observable<RecordingActPartyQueryResult[]> {
    Assertion.assertValue(query, 'query');

    const path = `v5/land/internal-search-services/recording-acts-parties`;

    return this.http.post<RecordingActPartyQueryResult[]>(path, query);
  }

}
