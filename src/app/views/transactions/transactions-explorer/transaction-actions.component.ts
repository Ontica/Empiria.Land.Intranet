/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { PERMISSIONS } from '@app/main-layout';

import { sendEvent } from '@app/shared/utils';

import { EmptyTransactionFilter, TransactionFilter } from '@app/models';


export enum TransactionActionsEventType {
  CREATE_TRANSACTION_CLICKED   = 'TransactionActionsComponent.Event.CreateTransactionClicked',
  FILTER_CHANGED               = 'TransactionActionsComponent.Event.FilterChanged',
  RECEIVE_TRANSACTIONS_CLICKED = 'TransactionActionsComponent.Event.ReceiveTransactionsClicked',
}

@Component({
  selector: 'emp-land-transaction-actions',
  templateUrl: './transaction-actions.component.html',
})
export class TransactionActionsComponent implements OnChanges {

  @Input() filter: TransactionFilter = EmptyTransactionFilter;

  @Output() transactionActionsEvent = new EventEmitter<EventInfo>();

  keywords = '';

  Permissions = PERMISSIONS;


  constructor() { }


  ngOnChanges() {
    this.keywords = this.filter.keywords;
  }


  onFilterChanged() {
    sendEvent(this.transactionActionsEvent, TransactionActionsEventType.FILTER_CHANGED,
      { keywords: this.keywords });
  }


  onCreateTransactionClicked() {
    sendEvent(this.transactionActionsEvent, TransactionActionsEventType.CREATE_TRANSACTION_CLICKED);
  }


  onReceiveTransactionsOptionsClicked() {
    sendEvent(this.transactionActionsEvent, TransactionActionsEventType.RECEIVE_TRANSACTIONS_CLICKED);
  }

}
