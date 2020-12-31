/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { EventInfo, isEmpty } from '@app/core';

import { PresentationLayer } from '@app/core/presentation';

import { TransactionStateSelector, MainUIStateSelector,
         DocumentsRecordingAction, DocumentsRecordingStateSelector,
         TransactionAction } from '@app/core/presentation/presentation-types';

import { Transaction, TransactionFilter,
         EmptyTransaction, EmptyTransactionFilter,
         mapTransactionStageFromViewName, mapTransactionStatusFromViewName,
         } from '@app/models/transaction';

import { View } from '@app/views/main-layout';

import { TransactionListEventType } from '../transaction-list/transaction-list.component';


@Component({
  selector: 'emp-land-transactions-main-page',
  templateUrl: './transactions-main-page.component.html'
})
export class TransactionsMainPageComponent implements OnInit, OnDestroy {

  currentView: View;

  transactionList: Transaction[] = [];
  selectedTransaction: Transaction = EmptyTransaction;
  filter: TransactionFilter = EmptyTransactionFilter;

  displayCreateTransactionEditor = false;
  displayRecordingActEditor = false;
  displayTransactionTabbedView = false;

  isLoading = false;

  private unsubscribe: Subject<void> = new Subject();

  constructor(private uiLayer: PresentationLayer) { }


  ngOnInit() {
    this.uiLayer.select<Transaction[]>(TransactionStateSelector.TRANSACTION_LIST)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(x => {
        this.transactionList = x;
        this.isLoading = false;
      });

    this.uiLayer.select<View>(MainUIStateSelector.CURRENT_VIEW)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(x => this.onCurrentViewChanged(x));

    this.uiLayer.select<Transaction>(TransactionStateSelector.SELECTED_TRANSACTION)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(x => {
        this.selectedTransaction = x;
        this.displayTransactionTabbedView = !isEmpty(this.selectedTransaction);
      });

    this.uiLayer.select<TransactionFilter>(TransactionStateSelector.LIST_FILTER)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(x => this.filter = x);

    this.uiLayer.select<Transaction>(DocumentsRecordingStateSelector.SELECTED_RECORDING_ACT)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(x => {
        this.selectedTransaction = x;
        this.displayRecordingActEditor = !isEmpty(this.selectedTransaction);
      });
  }


  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }


  onCloseEditor() {
    this.unselectCurrentTransaction();
  }


  onTransactionCreatorClosed() {
    this.displayCreateTransactionEditor = false;
  }


  onTransactionListEvent(event: EventInfo): void {
    switch (event.type as TransactionListEventType) {

      case TransactionListEventType.CREATE_TRANSACTION_CLICKED:
        this.displayCreateTransactionEditor = true;
        return;

      case TransactionListEventType.FILTER_CHANGED:
        this.applyTransactionsFilter(event.payload);
        return;

      case TransactionListEventType.TRANSACTION_OPTIONS_CLICKED:
        this.uiLayer.dispatch(DocumentsRecordingAction.SELECT_RECORDING_ACT,  event.payload);
        return;

      case TransactionListEventType.TRANSACTION_SELECTED:
        this.uiLayer.dispatch(TransactionAction.SELECT_TRANSACTION, event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  // private methods

  private applyTransactionsFilter(data?: { keywords: string }) {
    const currentKeywords =
        this.uiLayer.selectValue<TransactionFilter>(TransactionStateSelector.LIST_FILTER).keywords;

    const filter: TransactionFilter = {
      stage: mapTransactionStageFromViewName(this.currentView.name),
      status: mapTransactionStatusFromViewName(this.currentView.name),
      keywords: data ? data.keywords : currentKeywords,
    };

    this.isLoading = true;

    this.uiLayer.dispatch(TransactionAction.SET_LIST_FILTER, { filter });
  }


  private onCurrentViewChanged(newView: View) {
    this.currentView = newView;
    this.applyTransactionsFilter();
  }


  private unselectCurrentTransaction() {
    this.uiLayer.dispatch(TransactionAction.UNSELECT_TRANSACTION);
    this.uiLayer.dispatch(DocumentsRecordingAction.UNSELECT_RECORDING_ACT);
  }

}
