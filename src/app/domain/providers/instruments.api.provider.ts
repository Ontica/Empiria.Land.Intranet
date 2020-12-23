/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Observable } from 'rxjs';
import { Instrument } from '../models';


export abstract class InstrumentsApiProvider {

  abstract getTransactionInstrument(transactionUID: string): Observable<Instrument>;

}
