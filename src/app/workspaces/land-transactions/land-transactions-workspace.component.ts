/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, OnInit, OnDestroy } from '@angular/core';

import { Empty, EventInfo, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import {
  MainUIStateSelector, RegistrationAction, RegistrationStateSelector,
  TransactionAction, TransactionStateSelector,
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

import { BookEntry, EmptyBookEntry, EmptySelectionAct, EmptyRecordingBook,
         RecordingAct, SelectionAct, RecordingBook } from '@app/models';


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

  selectedBookEntry: BookEntry = EmptyBookEntry;
  selectedFileViewerData: FileViewerData = EmptyFileViewerData;
  selectedRecordingAct: SelectionAct = EmptySelectionAct;
  selectedRecordingBook: RecordingBook = EmptyRecordingBook;
  selectedTransaction: Transaction = EmptyTransaction;

  displayOptionModalSelected: TransactionModalOptions = null;
  selectedTransactions: TransactionShortModel[] = [];

  displayFileViewer = false;
  displayBookEntryEditor = false;
  displayRecordingActEditor = false;
  displayRecordingBookEditor = false;
  displayTransactionTabbedView = false;

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

        this.unselectCurrentSelections();
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

        this.unselectCurrentSelections();
      }, error => {
        this.isLoadingTransaction = false;
      });

    this.subscriptionHelper.select<TransactionFilter>(TransactionStateSelector.LIST_FILTER)
      .subscribe(x => this.filter = x);

    this.subscriptionHelper.select<SelectionAct>(RegistrationStateSelector.SELECTED_RECORDING_ACT)
      .subscribe(x => {
        this.selectedRecordingAct = x;
        this.displayRecordingActEditor = !isEmpty(this.selectedRecordingAct?.recordingAct);
      });

    this.subscriptionHelper.select<RecordingBook>(RegistrationStateSelector.SELECTED_RECORDING_BOOK)
      .subscribe(x => {
        this.selectedRecordingBook = x;
        this.displayRecordingBookEditor = !isEmpty(this.selectedRecordingBook);
      });

    this.subscriptionHelper.select<BookEntry>(RegistrationStateSelector.SELECTED_BOOK_ENTRY)
      .subscribe(x => {
        this.selectedBookEntry = x;
        this.displayBookEntryEditor = !isEmpty(this.selectedBookEntry);
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


  get secondaryEditorDisplayed(){
    return this.displayRecordingActEditor || this.displayRecordingBookEditor || this.displayBookEntryEditor;
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


  onCloseSecondaryEditor() {
    this.unselectCurrentSelections();
  }


  unselectCurrentSelections(){
    this.unselectCurrentFile();
    this.unselectCurrentRecordingAct();
    this.unselectCurrentRecordingBook();
    this.unselectCurrentBookEntry();
  }

  unselectCurrentBookEntry(){
    this.uiLayer.dispatch(RegistrationAction.UNSELECT_BOOK_ENTRY);
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
    this.uiLayer.dispatch(RegistrationAction.UNSELECT_RECORDING_ACT);
  }

  private unselectCurrentRecordingBook() {
    this.uiLayer.dispatch(RegistrationAction.UNSELECT_RECORDING_BOOK);
  }

}
