/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Assertion, HttpService } from '@app/core';

import { Agency, RecorderOffice, Transaction,
         TransactionFilter, TransactionShortModel, TransactionType } from '@app/models';


@Injectable()
export class TransactionDataService {

  constructor(private http: HttpService) { }

  getTransactionList(filter: TransactionFilter): Observable<TransactionShortModel[]> {
    let path = `v5/land/transactions`;

    if (filter.stage) {
      path += `/?stage=${filter.stage}`;
    }

    if (filter.status) {
        path += `&status=${filter.status}`;
    }

    if (filter.keywords) {
        path += `&keywords=${filter.keywords}`;
    }

    return this.http.get<TransactionShortModel[]>(path);
  }


  getTransaction(transactionUID: string): Observable<Transaction> {
    Assertion.assertValue(transactionUID, 'transactionUID');

    const path = `v5/land/transactions/${transactionUID}`;

    return this.http.get<Transaction>(path);
  }

  getTransactionTypes(): Observable<TransactionType[]> {
    const path = `v5/land/transaction-types`;

    return this.http.get<TransactionType[]>(path);
  }

  getAgencies(): Observable<Agency[]> {
    const path = `v5/land/agencies`;

    return this.http.get<Agency[]>(path);
  }

  getRecorderOffices(): Observable<RecorderOffice[]> {
    const path = `v5/land/recorder-offices`;

    return this.http.get<RecorderOffice[]>(path);
  }

}
