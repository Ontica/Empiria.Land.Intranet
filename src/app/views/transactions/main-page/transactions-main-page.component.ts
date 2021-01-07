/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, OnInit, OnDestroy } from '@angular/core';

import { EventInfo, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { TransactionStateSelector, MainUIStateSelector,
         DocumentsRecordingAction, DocumentsRecordingStateSelector,
         TransactionAction} from '@app/core/presentation/presentation-types';

import { TransactionShortModel, Transaction, EmptyTransaction, TransactionFilter, EmptyTransactionFilter,
         mapTransactionStageFromViewName, mapTransactionStatusFromViewName } from '@app/models/transaction';

import { View } from '@app/views/main-layout';

import { TransactionListEventType } from '../transaction-list/transaction-list.component';


@Component({
  selector: 'emp-land-transactions-main-page',
  templateUrl: './transactions-main-page.component.html'
})
export class TransactionsMainPageComponent implements OnInit, OnDestroy {

  currentView: View;

  transactionList: TransactionShortModel[] = [];
  selectedTransaction: Transaction = EmptyTransaction;
  filter: TransactionFilter = EmptyTransactionFilter;

  displayCreateTransactionEditor = false;
  displayRecordingActEditor = false;
  displayTransactionTabbedView = false;

  isLoading = false;

  subscriptionHelper: SubscriptionHelper;

  constructor(private uiLayer: PresentationLayer) {
    this.subscriptionHelper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit() {
    this.subscriptionHelper.select<TransactionShortModel[]>(TransactionStateSelector.TRANSACTION_LIST)
      .subscribe(x => {
        this.transactionList = x;
        this.isLoading = false;
      });


    this.subscriptionHelper.select<View>(MainUIStateSelector.CURRENT_VIEW)
      .subscribe(x => this.onCurrentViewChanged(x));


    this.subscriptionHelper.select<Transaction>(TransactionStateSelector.SELECTED_TRANSACTION)
      .subscribe(x => {
        this.selectedTransaction = x;
        this.displayTransactionTabbedView = !isEmpty(this.selectedTransaction);
      });


    this.subscriptionHelper.select<TransactionFilter>(TransactionStateSelector.LIST_FILTER)
      .subscribe(x => this.filter = x);


    this.subscriptionHelper.select<Transaction>(DocumentsRecordingStateSelector.SELECTED_RECORDING_ACT)
      .subscribe(x => {
        this.selectedTransaction = x;
        this.displayRecordingActEditor = !isEmpty(this.selectedTransaction);
      });
  }


  ngOnDestroy() {
    this.subscriptionHelper.destroy();
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
        this.uiLayer.dispatch(DocumentsRecordingAction.SELECT_RECORDING_ACT,
                              {'transactionUID': event.payload.transaction.uid});
        return;

      case TransactionListEventType.TRANSACTION_SELECTED:
        this.uiLayer.dispatch(TransactionAction.SELECT_TRANSACTION,
                              {'transactionUID': event.payload.transaction.uid});
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
