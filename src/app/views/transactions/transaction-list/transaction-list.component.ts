/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

import { SelectionModel } from '@angular/cdk/collections';

import { EventInfo } from '@app/core';

import { TransactionShortModel, EmptyTransaction, Transaction, TransactionFilter,
         EmptyTransactionFilter } from '@app/models';

import { expandCollapse } from '@app/shared/animations/animations';

import { sendEvent } from '@app/shared/utils';

export enum TransactionListEventType {
  CREATE_TRANSACTION_CLICKED = 'TransactionListComponent.Event.CreateTransactionClicked',
  FILTER_CHANGED = 'TransactionListComponent.Event.FilterChanged',
  TRANSACTION_OPTIONS_CLICKED = 'TransactionListComponent.Event.TransactionOptionsClicked',
  TRANSACTION_SELECTED = 'TransactionListComponent.Event.TransactionSelected',
  TRANSACTIONS_SELECTED_OPTIONS_CLICKED = 'TransactionListComponent.Event.TransactionsSelectedOptionsClicked',
  RECEIVE_TRANSACTIONS_CLICKED = 'TransactionListComponent.Event.ReceiveTransactionsClicked',
}

@Component({
  selector: 'emp-land-transaction-list',
  templateUrl: './transaction-list.component.html',
  animations: [
    expandCollapse
  ],
})
export class TransactionListComponent implements OnChanges {

  @Input() transactionList: TransactionShortModel[] = [];

  @Input() selectedTransaction: Transaction = EmptyTransaction;

  @Input() filter: TransactionFilter = EmptyTransactionFilter;

  @Input() title = 'Trámites';

  @Input() isLoading = false;

  @Output() transactionListEvent = new EventEmitter<EventInfo>();

  keywords = '';

  selection = new SelectionModel<TransactionShortModel>(true, []);


  ngOnChanges(changes: SimpleChanges) {
    if (changes.filter) {
      this.keywords = this.filter.keywords;
    }

    if (changes.filter || changes.transactionList) {
      this.selection.clear();
    }
  }


  isSelected(transaction: TransactionShortModel) {
    return (this.selectedTransaction.uid === transaction.uid);
  }


  onChangeFilter() {
    sendEvent(this.transactionListEvent, TransactionListEventType.FILTER_CHANGED, {keywords: this.keywords});
  }


  onClickCreateTransaction() {
    sendEvent(this.transactionListEvent, TransactionListEventType.CREATE_TRANSACTION_CLICKED);
  }


  onClickTransactionOptions(transaction: TransactionShortModel) {
    sendEvent(this.transactionListEvent, TransactionListEventType.TRANSACTION_OPTIONS_CLICKED, {transaction});
  }


  onSelectTransaction(transaction: TransactionShortModel) {
    sendEvent(this.transactionListEvent, TransactionListEventType.TRANSACTION_SELECTED, {transaction});
  }


  onClickTransactionsSelectedOptions() {
    sendEvent(this.transactionListEvent, TransactionListEventType.TRANSACTIONS_SELECTED_OPTIONS_CLICKED,
      { transactions: this.selection.selected });
  }


  onClickReceiveTransactionsOptions() {
    sendEvent(this.transactionListEvent, TransactionListEventType.RECEIVE_TRANSACTIONS_CLICKED);
  }

}
