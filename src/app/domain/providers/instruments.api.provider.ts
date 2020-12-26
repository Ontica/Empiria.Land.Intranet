/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Observable } from 'rxjs';

import { Instrument, Issuer, IssuersFilter, ModificationInstrument } from '../models';

export abstract class InstrumentsApiProvider {

  abstract findIssuers(filter: IssuersFilter): Observable<Issuer[]>;

  abstract getTransactionInstrument(transactionUID: string): Observable<Instrument>;

  abstract createTransactionInstrument(transactionUID: string,
                                       instrument: ModificationInstrument): Observable<Instrument>;

  abstract updateTransactionInstrument(transactionUID: string,
                                       instrument: ModificationInstrument): Observable<Instrument>;

}
