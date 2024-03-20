/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

import { SelectionModel } from '@angular/cdk/collections';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { TransactionShortModel, EmptyTransaction, Transaction, TransactionFilter,
         EmptyTransactionFilter } from '@app/models';

import { TransactionActionsEventType } from './transaction-actions.component';

import { TransactionControlsEventType } from './transaction-controls.component';

import { TransactionListEventType } from './transaction-list.component';

export enum TransactionExplorerEventType {
  CREATE_TRANSACTION_CLICKED     = 'TransactionExplorerComponent.Event.CreateTransactionClicked',
  FILTER_CHANGED                 = 'TransactionExplorerComponent.Event.FilterChanged',
  RECEIVE_TRANSACTIONS_CLICKED   = 'TransactionExplorerComponent.Event.ReceiveTransactionsClicked',
  TRANSACTION_SELECTED           = 'TransactionExplorerComponent.Event.TransactionSelected',
  TRANSACTION_EXECUTE_OPERATION  = 'TransactionExplorerComponent.Event.TransactionExecuteOperation',
  TRANSACTIONS_EXECUTE_OPERATION = 'TransactionExplorerComponent.Event.TransactionsExecuteOperation',
}

@Component({
  selector: 'emp-land-transaction-explorer',
  templateUrl: './transaction-explorer.component.html',
})
export class TransactionExplorerComponent implements OnChanges {

  @Input() transactionList: TransactionShortModel[] = [];

  @Input() selectedTransaction: Transaction = EmptyTransaction;

  @Input() filter: TransactionFilter = EmptyTransactionFilter;

  @Input() title = 'Trámites';

  @Input() isLoading = false;

  @Output() transactionExplorerEvent = new EventEmitter<EventInfo>();

  selection = new SelectionModel<TransactionShortModel>(true, []);


  ngOnChanges(changes: SimpleChanges) {
    if (changes.filter || changes.transactionList) {
      this.selection.clear();
    }
  }


  onTransactionActionsEvent(event: EventInfo) {
    switch (event.type as TransactionActionsEventType) {
      case TransactionActionsEventType.FILTER_CHANGED:
        sendEvent(this.transactionExplorerEvent, TransactionExplorerEventType.FILTER_CHANGED, event.payload);
        return;

      case TransactionActionsEventType.CREATE_TRANSACTION_CLICKED:
        sendEvent(this.transactionExplorerEvent, TransactionExplorerEventType.CREATE_TRANSACTION_CLICKED);
        return;

      case TransactionActionsEventType.RECEIVE_TRANSACTIONS_CLICKED:
        sendEvent(this.transactionExplorerEvent, TransactionExplorerEventType.RECEIVE_TRANSACTIONS_CLICKED);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onTransactionControlsEvent(event: EventInfo) {
    switch (event.type as TransactionControlsEventType) {
      case TransactionControlsEventType.EXECUTE_OPERATION_CLICKED:
        Assertion.assertValue(event.payload.operation, 'event.payload.operation');
        Assertion.assertValue(event.payload.transactions, 'event.payload.transactions');
        sendEvent(this.transactionExplorerEvent, TransactionExplorerEventType.TRANSACTIONS_EXECUTE_OPERATION,
          event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onTransactionListEvent(event: EventInfo) {
    switch (event.type as TransactionListEventType) {
      case TransactionListEventType.TRANSACTION_SELECTED:
        sendEvent(this.transactionExplorerEvent, TransactionExplorerEventType.TRANSACTION_SELECTED,
          event.payload);
        return;

      case TransactionListEventType.TRANSACTION_EXECUTE_OPERATION:
        sendEvent(this.transactionExplorerEvent, TransactionExplorerEventType.TRANSACTION_EXECUTE_OPERATION,
          event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }

}
