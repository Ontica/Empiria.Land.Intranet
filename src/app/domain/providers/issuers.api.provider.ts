/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Observable } from 'rxjs';
import { DateString } from '@app/core';
import { InstrumentType, Issuer } from '../models';


export abstract class IssuersApiProvider {

  abstract getIssuerList(instrumentType: InstrumentType,
                         instrumentKind?: string,
                         onDate?: DateString,
                         keywords?: string): Observable<Issuer[]>;

}
