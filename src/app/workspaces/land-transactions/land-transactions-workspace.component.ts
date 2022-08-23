/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, OnInit, OnDestroy } from '@angular/core';

import { EventInfo, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { MainUIStateSelector, RegistrationAction, RegistrationStateSelector, TransactionAction,
         TransactionStateSelector} from '@app/core/presentation/presentation-types';

import { View } from '@app/main-layout';

import { TransactionShortModel, Transaction, EmptyTransaction, TransactionFilter, EmptyTransactionFilter,
         mapTransactionStageFromViewName, mapTransactionStatusFromViewName, EmptyRecordingContext,
         RecordingContext } from '@app/models';

import { EmptyFileViewerData, FileViewerData} from '@app/shared/form-controls/file-control/file-control-data';

import { TransactionListEventType} from '@app/views/transactions/transaction-list/transaction-list.component';

import {
  RecordableSubjectTabbedViewEventType
} from '@app/views/registration/recordable-subject/recordable-subject-tabbed-view.component';

import {
  RecordingActEditionEventType
} from '@app/views/registration/recording-acts/recording-act-edition.component';


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

  selectedFileViewerData: FileViewerData = EmptyFileViewerData;
  selectedTransaction: Transaction = EmptyTransaction;
  selectedRecordingContext: RecordingContext = EmptyRecordingContext;

  displayOptionModalSelected: TransactionModalOptions = null;
  selectedTransactions: TransactionShortModel[] = [];

  displayFileViewer = false;
  displayRecordableSubjectTabbedView = false;
  displayRecordingActEditor = false;
  displayTransactionTabbedView = false;

  isLoading = false;
  isLoadingTransaction = false;

  subscriptionHelper: SubscriptionHelper;

  constructor(private uiLayer: PresentationLayer) {
    this.subscriptionHelper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit() {
    this.subscribeToDataInit();
    this.suscribeToSelectedData();
  }


  ngOnDestroy() {
    this.subscriptionHelper.destroy();
  }


  get secondaryEditorDisplayed(){
    return this.displayRecordableSubjectTabbedView || this.displayRecordingActEditor;
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


  onRecordableSubjectTabbedViewEvent(event: EventInfo) {
    switch (event.type as RecordableSubjectTabbedViewEventType) {

      case RecordableSubjectTabbedViewEventType.CLOSE_BUTTON_CLICKED:
        this.unselectSecondaryEditors();
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onRecordingActEditionEventType(event: EventInfo) {
    switch (event.type as RecordingActEditionEventType) {

      case RecordingActEditionEventType.CLOSE_BUTTON_CLICKED:
        this.unselectSecondaryEditors();
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onOptionModalClosed() {
    this.displayOptionModalSelected = null;
  }


  onCloseTransactionEditor() {
    this.unselectCurrentTransaction();
  }


  onCloseFileViewer() {
    this.unselectCurrentFile();
  }

  // private methods

  private subscribeToDataInit() {
    this.subscriptionHelper.select<TransactionShortModel[]>(TransactionStateSelector.TRANSACTION_LIST)
      .subscribe(x => {
        this.transactionList = x;
        this.isLoading = false;
        this.unselectCurrentSelections();
      }, error => this.isLoading = false);

    this.subscriptionHelper.select<View>(MainUIStateSelector.CURRENT_VIEW)
      .subscribe(x => this.onCurrentViewChanged(x));

    this.subscriptionHelper.select<Transaction>(TransactionStateSelector.SELECTED_TRANSACTION)
      .subscribe(x => {
        this.selectedTransaction = x;
        this.isLoadingTransaction = false;
        this.displayTransactionTabbedView = !isEmpty(this.selectedTransaction);
        this.unselectCurrentSelections();
      }, error => this.isLoadingTransaction = false);

    this.subscriptionHelper.select<TransactionFilter>(TransactionStateSelector.LIST_FILTER)
      .subscribe(x => this.filter = x);
  }


  private suscribeToSelectedData() {
    this.subscriptionHelper.select<RecordingContext>(RegistrationStateSelector.SELECTED_RECORDABLE_SUBJECT)
      .subscribe(x => {
        this.selectedRecordingContext = x;
        this.displayRecordableSubjectTabbedView = this.isRecordingContextValid();
      });

    this.subscriptionHelper.select<RecordingContext>(RegistrationStateSelector.SELECTED_RECORDING_ACT)
      .subscribe(x => {
        this.selectedRecordingContext = x;
        this.displayRecordingActEditor = this.isRecordingContextValid();
      });

    this.subscriptionHelper.select<FileViewerData>(TransactionStateSelector.SELECTED_FILE_LIST)
      .subscribe(x => {
        this.selectedFileViewerData = x;
        this.displayFileViewer = this.selectedFileViewerData.fileList.length > 0;
      });
  }


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


  private unselectCurrentSelections(){
    this.unselectCurrentFile();
    this.unselectSecondaryEditors();
  }


  private unselectSecondaryEditors() {
    this.uiLayer.dispatch(RegistrationAction.UNSELECT_RECORDABLE_SUBJECT);
    this.uiLayer.dispatch(RegistrationAction.UNSELECT_RECORDING_ACT);
  }


  private isRecordingContextValid() {
    return !!this.selectedRecordingContext.instrumentRecordingUID &&
           !!this.selectedRecordingContext.recordingActUID;
  }

}
