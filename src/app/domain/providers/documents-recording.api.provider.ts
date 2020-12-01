/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Observable } from 'rxjs';
import { RecordingDocument } from '../models';


export abstract class DocumentsRecordingApiProvider {

    abstract getRecordingDocument(uid: string): Observable<RecordingDocument>;
    
}
