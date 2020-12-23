/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpService } from '@app/core';

import { Transaction, TransactionStagesType, TransactionStatusType } from '@app/domain/models';
import { TransactionApiProvider } from '@app/domain/providers/transaction.api.provider';


@Injectable()
export class TransactionApiHttpProvider extends TransactionApiProvider {

  constructor(private http: HttpService) {
    super();
  }


  getTransactionList(stage?: TransactionStagesType,
                     status?: TransactionStatusType,
                     keywords?: string): Observable<Transaction[]> {
    let path = `v5/land/transactions`;

    if (stage) {
      path += `/?stage=${stage}`;
      if (status) {
        path += `&status=${status}`;
      }
      if (keywords) {
        path += `&keywords=${keywords}`;
      }
    } else if (status) {
      path += `/?status=${status}`;
      if (keywords) {
        path += `&keywords=${keywords}`;
      }
    } else if (keywords) {
      path += `/?keywords=${keywords}`;
    }

    return this.http.get<Transaction[]>(path);
  }

}
