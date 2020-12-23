/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Observable } from 'rxjs';
import { InstrumentType } from '../models';


export abstract class InstrumentTypesApiProvider {

  abstract getInstrumentKindsList(instrumentType?: InstrumentType): Observable<string[]>;

}
