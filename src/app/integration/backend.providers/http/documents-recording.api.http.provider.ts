/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Assertion, HttpService } from '@app/core';

import { DocumentsRecordingApiProvider } from '@app/domain/providers';

import { RecordingDocument } from '@app/domain/entities';


@Injectable()
export class DocumentsRecordingApiHttpProvider extends DocumentsRecordingApiProvider {

  constructor(private http: HttpService) {
    super();
  }


  getRecordingDocument(uid: string): Observable<RecordingDocument> {
    Assertion.assertValue(uid, 'uid');

    const path = `v5/land/recording-documents/${uid}`;

    return this.http.get<RecordingDocument>(path);
  }

}
