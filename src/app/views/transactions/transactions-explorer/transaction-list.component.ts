/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, Output, EventEmitter } from '@angular/core';

import { SelectionModel } from '@angular/cdk/collections';

import { EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { TransactionShortModel, EmptyTransaction, Transaction } from '@app/models';

export enum TransactionListEventType {
  TRANSACTION_EXECUTE_OPERATION = 'TransactionExplorerComponent.Event.TransactionExecuteOperation',
  TRANSACTION_SELECTED          = 'TransactionListComponent.Event.TransactionSelected',
}

@Component({
  selector: 'emp-land-transaction-list',
  templateUrl: './transaction-list.component.html',
})
export class TransactionListComponent {

  @Input() transactionList: TransactionShortModel[] = [];

  @Input() selectedTransaction: Transaction = EmptyTransaction;

  @Input() selection = new SelectionModel<TransactionShortModel>(true, []);

  @Input() isLoading = false;

  @Output() transactionListEvent = new EventEmitter<EventInfo>();


  onTransactionClicked(transaction: TransactionShortModel) {
    sendEvent(this.transactionListEvent, TransactionListEventType.TRANSACTION_SELECTED, {transaction});
  }


  onTransactionOperationClicked(transaction: TransactionShortModel) {
    sendEvent(this.transactionListEvent, TransactionListEventType.TRANSACTION_EXECUTE_OPERATION, {transaction});
  }

}
