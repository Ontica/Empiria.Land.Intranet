/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Assertion, HttpService } from '@app/core';

import { Agency, TransactionFields, RecorderOffice, Transaction,
         TransactionFilter, TransactionShortModel, TransactionType, ProvidedServiceType } from '@app/models';


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


  createTransaction(transaction: TransactionFields): Observable<Transaction> {
    Assertion.assertValue(transaction, 'transaction');

    const path = `v5/land/transactions`;

    return this.http.post<Transaction>(path, transaction);
  }


  updateTransaction(transactionUID: string,
                    transaction: TransactionFields): Observable<Transaction> {
    Assertion.assertValue(transactionUID, 'transactionUID');
    Assertion.assertValue(transaction, 'transaction');

    const path = `v5/land/transactions/${transactionUID}`;

    return this.http.put<Transaction>(path, transaction);
  }


  deleteTransaction(transactionUID: string): Observable<Transaction> {
    Assertion.assertValue(transactionUID, 'transactionUID');

    const path = `v5/land/transactions/${transactionUID}`;

    return this.http.delete<Transaction>(path);
  }


  cloneTransaction(transactionUID: string): Observable<Transaction> {
    Assertion.assertValue(transactionUID, 'transactionUID');

    const path = `v5/land/transactions/${transactionUID}/clone`;

    return this.http.post<Transaction>(path);
  }


  getTransactionTypes(): Observable<TransactionType[]> {
    const path = `v5/land/transaction-types`;

    return this.http.get<TransactionType[]>(path);
  }


  getAgencies(): Observable<Agency[]> {
    const path = `v5/land/agencies`;

    return this.http.get<Agency[]>(path);
  }


  getProvidedServices(): Observable<ProvidedServiceType[]> {
    const path = `v5/land/provided-services`;

    return this.http.get<ProvidedServiceType[]>(path);
  }


  getRecorderOffices(): Observable<RecorderOffice[]> {
    const path = `v5/land/recorder-offices`;

    return this.http.get<RecorderOffice[]>(path);
  }

}
