/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

import { EventInfo } from '@app/core';

import { Transaction, EmptyTransaction,
         TransactionFilter, EmptyTransactionFilter } from '@app/models';


export enum TransactionListEventType {
  CREATE_TRANSACTION_CLICKED  = 'TransactionListComponent.Event.CreateTransactionClicked',
  FILTER_CHANGED              = 'TransactionListComponent.Event.FilterChanged',
  TRANSACTION_OPTIONS_CLICKED =  'TransactionListComponent.Event.TransactionOptionsClicked',
  TRANSACTION_SELECTED        = 'TransactionListComponent.Event.TransactionSelected'
}


@Component({
  selector: 'emp-land-transaction-list',
  templateUrl: './transaction-list.component.html'
})
export class TransactionListComponent implements OnChanges {

  @Input() transactionList: Transaction[] = [];

  @Input() selectedTransaction: Transaction = EmptyTransaction;

  @Input() filter: TransactionFilter = EmptyTransactionFilter;

  @Input() title = 'Trámites';

  @Input() isLoading = false;

  @Output() transactionListEvent = new EventEmitter<EventInfo>();

  keywords = '';


  ngOnChanges(changes: SimpleChanges) {
    if (changes.filter) {
      this.keywords = this.filter.keywords;
    }
  }


  isSelected(transaction: Transaction) {
    return (this.selectedTransaction.uid === transaction.uid);
  }


  onChangeFilter() {
    this.sendEvent(TransactionListEventType.FILTER_CHANGED, { keywords: this.keywords });
  }


  onClickCreateTransaction() {
    this.sendEvent(TransactionListEventType.CREATE_TRANSACTION_CLICKED);
  }


  onClickTransactionOptions(transaction: Transaction) {
    this.sendEvent(TransactionListEventType.TRANSACTION_OPTIONS_CLICKED, { transaction });
  }


  onSelectTransaction(transaction: Transaction) {
    this.sendEvent(TransactionListEventType.TRANSACTION_SELECTED, { transaction });
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
