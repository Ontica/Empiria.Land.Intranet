/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Observable } from 'rxjs';
import { Transaction, TransactionStagesType, TransactionStatusType } from '@app/domain/models';


export abstract class TransactionApiProvider {

  abstract getTransactionList(stage?: TransactionStagesType,
                              status?: TransactionStatusType,
                              keywords?: string): Observable<Transaction[]>;

}
