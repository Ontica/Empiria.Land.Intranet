/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Assertion, HttpService } from '@app/core';

import { ESignRequestsQuery, TransactionDescriptor } from '@app/models';


@Injectable()
export class ESignDataService {


  constructor(private http: HttpService) { }


  searchESignRequestedTransactions(query: ESignRequestsQuery): Observable<TransactionDescriptor[]> {
    Assertion.assertValue(query, 'query');

    const path = `v5/land/electronic-sign/requests/transactions/mine`;

    return this.http.post<TransactionDescriptor[]>(path, query);
  }

}
