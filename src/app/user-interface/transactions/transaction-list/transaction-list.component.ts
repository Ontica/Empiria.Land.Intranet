/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

import { EventInfo } from '@app/core';

import { PresentationLayer } from '@app/core/presentation';

import { Transaction, EmptyTransaction,
         TransactionFilter, EmptyTransactionFilter } from '@app/models';

import { TransactionAction, DocumentsRecordingAction } from '@app/core/presentation/state.commands';


export enum TransactionListEventType {
  SET_FILTER                     = 'TransactionListComponent.Event.SetFilter',
  SHOW_CREATE_TRANSACTION_EDITOR = 'TransactionListComponent.Event.ShowCreateTransactionEditor'
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

  constructor(private uiLayer: PresentationLayer) { }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.filter) {
      this.keywords = this.filter.keywords;
    }
  }


  isSelected(transaction: Transaction) {
    return (this.selectedTransaction.uid === transaction.uid);
  }


  onFilterChange() {
    this.sendSetFilterEvent();
  }


  onSelect(transaction: Transaction) {
    this.uiLayer.dispatch(TransactionAction.SELECT_TRANSACTION, { transaction });
  }

  onSelectRecordingAct(transaction: Transaction) {
    this.uiLayer.dispatch(DocumentsRecordingAction.SELECT_RECORDING_ACT, { transaction });
  }

  onClickCreateTransactionButton() {
    this.sendShowCreateTransactionEditorEvent();
  }


  // private methods

  private sendShowCreateTransactionEditorEvent() {
    const event: EventInfo = {
      type: TransactionListEventType.SHOW_CREATE_TRANSACTION_EDITOR
    };

    this.transactionListEvent.emit(event);
  }

  private sendSetFilterEvent() {
    const event: EventInfo = {
      type: TransactionListEventType.SET_FILTER,
      payload: { keywords: this.keywords }
    };

    this.transactionListEvent.emit(event);
  }

}
