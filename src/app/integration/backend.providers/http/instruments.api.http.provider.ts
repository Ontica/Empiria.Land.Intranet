/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpService } from '@app/core';

import { InstrumentsApiProvider } from '@app/domain/providers/instruments.api.provider';
import { Instrument } from '@app/domain/models';


@Injectable()
export class InstrumentsApiHttpProvider extends InstrumentsApiProvider {

  constructor(private http: HttpService) {
    super();
  }

  getTransactionInstrument(transactionUID: string): Observable<Instrument> {
    let path = `v5/land/transactions/${transactionUID}/instrument`;
    return this.http.get<Instrument>(path);
  }

}
