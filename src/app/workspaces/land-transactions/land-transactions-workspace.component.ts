/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, OnInit, OnDestroy } from '@angular/core';

import { EventInfo, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import {
  TransactionStateSelector, MainUIStateSelector,
  RecordingActsAction, RecordingActsStateSelector,
  TransactionAction
} from '@app/core/presentation/presentation-types';

import {
  TransactionShortModel, Transaction, EmptyTransaction, TransactionFilter, EmptyTransactionFilter,
  mapTransactionStageFromViewName, mapTransactionStatusFromViewName
} from '@app/models/transaction';


import {
  TransactionListEventType
} from '@app/views/transactions/transaction-list/transaction-list.component';

import { EmptyFileViewerData,
         FileViewerData } from '@app/shared/form-controls/file-control/file-control-data';

import { View } from '../main-layout';

import { EmptyRecordingAct, RecordingAct } from '@app/models';


type TransactionModalOptions = 'CreateTransactionEditor' | 'ExecuteCommand' | 'ExecuteCommandMultiple' |
                               'ReceiveTransactions';


@Component({
  selector: 'emp-land-transactions-workspace',
  templateUrl: './land-transactions-workspace.component.html'
})
export class LandTransactionsWorkspaceComponent implements OnInit, OnDestroy {

  currentView: View;

  transactionList: TransactionShortModel[] = [];
  filter: TransactionFilter = EmptyTransactionFilter;

  selectedTransaction: Transaction = EmptyTransaction;
  selectedFileViewerData: FileViewerData = EmptyFileViewerData;
  selectedRecordingAct: RecordingAct = EmptyRecordingAct;

  displayOptionModalSelected: TransactionModalOptions = null;
  selectedTransactions: TransactionShortModel[] = [];

  displayRecordingActEditor = false;
  displayTransactionTabbedView = false;
  displayFileViewer = false;

  isLoading = false;
  isLoadingTransaction = false;

  subscriptionHelper: SubscriptionHelper;

  constructor(private uiLayer: PresentationLayer) {
    this.subscriptionHelper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit() {
    this.subscriptionHelper.select<TransactionShortModel[]>(TransactionStateSelector.TRANSACTION_LIST)
      .subscribe(x => {
        this.transactionList = x;
        this.isLoading = false;

        this.unselectCurrentRecordingAct();
      }, error => {
        this.isLoading = false;
      });


    this.subscriptionHelper.select<View>(MainUIStateSelector.CURRENT_VIEW)
      .subscribe(x => this.onCurrentViewChanged(x));


    this.subscriptionHelper.select<Transaction>(TransactionStateSelector.SELECTED_TRANSACTION)
      .subscribe(x => {
        this.selectedTransaction = x;
        this.isLoadingTransaction = false;
        this.displayTransactionTabbedView = !isEmpty(this.selectedTransaction);

        this.unselectCurrentRecordingAct();
      }, error => {
        this.isLoadingTransaction = false;
      });


    this.subscriptionHelper.select<TransactionFilter>(TransactionStateSelector.LIST_FILTER)
      .subscribe(x => this.filter = x);


    this.subscriptionHelper.select<RecordingAct>
      (RecordingActsStateSelector.SELECTED_RECORDING_ACT)
      .subscribe(x => {
        this.selectedRecordingAct = x;
        this.displayRecordingActEditor = !isEmpty(this.selectedRecordingAct);
      });

    this.subscriptionHelper.select<FileViewerData>(TransactionStateSelector.SELECTED_FILE_LIST)
      .subscribe(x => {
        this.selectedFileViewerData = x;
        this.displayFileViewer = this.selectedFileViewerData.fileList.length > 0;
      });
  }


  ngOnDestroy() {
    this.subscriptionHelper.destroy();
  }


  onCloseEditor() {
    this.unselectCurrentTransaction();
  }


  onOptionModalClosed() {
    this.displayOptionModalSelected = null;
  }


  onTransactionListEvent(event: EventInfo): void {
    switch (event.type as TransactionListEventType) {

      case TransactionListEventType.CREATE_TRANSACTION_CLICKED:
        this.displayOptionModalSelected = 'CreateTransactionEditor';
        return;

      case TransactionListEventType.FILTER_CHANGED:
        this.applyTransactionsFilter(event.payload);
        return;

      case TransactionListEventType.TRANSACTION_OPTIONS_CLICKED:
        this.displayOptionModalSelected = 'ExecuteCommand';
        this.selectedTransactions = [event.payload.transaction];
        return;

      case TransactionListEventType.TRANSACTION_SELECTED:
        this.isLoadingTransaction = true;
        this.uiLayer.dispatch(TransactionAction.SELECT_TRANSACTION,
                              { transactionUID: event.payload.transaction.uid });
        return;

      case TransactionListEventType.TRANSACTIONS_SELECTED_OPTIONS_CLICKED:
        this.displayOptionModalSelected = 'ExecuteCommandMultiple';
        this.selectedTransactions = event.payload.transactions;
        return;

      case TransactionListEventType.RECEIVE_TRANSACTIONS_CLICKED:
        this.displayOptionModalSelected = 'ReceiveTransactions';
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onCloseFileViewer() {
    this.unselectCurrentFile();
    this.unselectCurrentRecordingAct();
  }


  onCloseRecordingActEditor() {
    this.unselectCurrentFile();
    this.unselectCurrentRecordingAct();
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
  }


  private unselectCurrentFile() {
    this.uiLayer.dispatch(TransactionAction.UNSELECT_FILE_LIST);
  }

  private unselectCurrentRecordingAct() {
    this.uiLayer.dispatch(RecordingActsAction.UNSELECT_RECORDING_ACT);
  }

}
