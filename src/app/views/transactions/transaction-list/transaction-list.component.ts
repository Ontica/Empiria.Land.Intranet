/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

import { EventInfo } from '@app/core';

import {
  TransactionShortModel, EmptyTransaction, Transaction,
  TransactionFilter, EmptyTransactionFilter
} from '@app/models';

import { expandCollapse } from '@app/shared/animations/animations';


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
    this.sendEvent(TransactionListEventType.FILTER_CHANGED, { keywords: this.keywords });
  }


  onClickCreateTransaction() {
    this.sendEvent(TransactionListEventType.CREATE_TRANSACTION_CLICKED);
  }


  onClickTransactionOptions(transaction: TransactionShortModel) {
    this.sendEvent(TransactionListEventType.TRANSACTION_OPTIONS_CLICKED, { transaction });
  }


  onSelectTransaction(transaction: TransactionShortModel) {
    this.sendEvent(TransactionListEventType.TRANSACTION_SELECTED, { transaction });
  }


  onClickTransactionsSelectedOptions() {
    this.sendEvent(TransactionListEventType.TRANSACTIONS_SELECTED_OPTIONS_CLICKED,
      { transactions: this.selection.selected });
  }

  onClickReceiveTransactionsOptions() {
    this.sendEvent(TransactionListEventType.RECEIVE_TRANSACTIONS_CLICKED);
  }

  // private methods


  private sendEvent(eventType: TransactionListEventType, payload?: any) {
    const event: EventInfo = {
      type: eventType,
      payload
    };

    this.transactionListEvent.emit(event);
  }

}
