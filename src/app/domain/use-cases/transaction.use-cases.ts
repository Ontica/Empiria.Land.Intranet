/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Assertion } from '@app/core';

import { TransactionApiProvider } from '../providers';

import { Transaction, TransactionFilter } from '@app/domain/models';


@Injectable()
export class TransactionUseCases {

  constructor(private backend: TransactionApiProvider) { }

  getTransactionList(filter: TransactionFilter): Observable<Transaction[]> {
    Assertion.assertValue(filter, 'filter');

    return this.backend.getTransactionList(filter.stage, filter.status, filter.keywords);
  }

}
