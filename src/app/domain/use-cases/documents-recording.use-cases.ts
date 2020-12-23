/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';
import { Assertion } from '@app/core';
import { Observable } from 'rxjs';
import { RecordingDocument } from '../models';
import { DocumentsRecordingApiProvider } from '../providers/documents-recording.api.provider';


@Injectable()
export class DocumentsRecordingUseCases {

  constructor(private backend: DocumentsRecordingApiProvider) { }

  getRecordingDocument(uid: string): Observable<RecordingDocument> {
    Assertion.assertValue(uid, 'uid');

    return this.backend.getRecordingDocument(uid);
  }

}
