/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpService } from '@app/core';

import { Transaction, TransactionFilter } from '@app/domain/models';


@Injectable()
export class TransactionDataService {

  constructor(private http: HttpService) { }

  getTransactionList(filter: TransactionFilter): Observable<Transaction[]> {
    let path = `v5/land/transactions`;

    if (filter.stage) {
      path += `/?stage=${filter.stage}`;

      if (filter.status) {
        path += `&status=${filter.status}`;
      }
      if (filter.keywords) {
        path += `&keywords=${filter.keywords}`;
      }
    } else if (filter.status) {
      path += `/?status=${filter.status}`;
      if (filter.keywords) {
        path += `&keywords=${filter.keywords}`;
      }
    } else if (filter.keywords) {
      path += `/?keywords=${filter.keywords}`;
    }

    return this.http.get<Transaction[]>(path);
  }

}
