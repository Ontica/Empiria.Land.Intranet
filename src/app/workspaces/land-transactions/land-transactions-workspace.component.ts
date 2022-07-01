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
         mapTransactionStageFromViewName, mapTransactionStatusFromViewName, EmptySelectionAct,
         SelectionAct } from '@app/models';

import { EmptyFileViewerData, FileViewerData} from '@app/shared/form-controls/file-control/file-control-data';

import { TransactionListEventType} from '@app/views/transactions/transaction-list/transaction-list.component';

import {
  RecordableSubjectTabbedViewEventType
} from '@app/views/registration/recordable-subject-tabbed-view/recordable-subject-tabbed-view.component';


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
  selectedRecordableSubject: SelectionAct = EmptySelectionAct;
  selectedRecordingAct: SelectionAct = EmptySelectionAct;
  selectedTransaction: Transaction = EmptyTransaction;

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

    this.subscriptionHelper.select<SelectionAct>(RegistrationStateSelector.SELECTED_RECORDABLE_SUBJECT)
      .subscribe(x => {
        this.selectedRecordableSubject = x;
        this.displayRecordableSubjectTabbedView = !isEmpty(this.selectedRecordableSubject?.recordingAct);
      });

    this.subscriptionHelper.select<SelectionAct>(RegistrationStateSelector.SELECTED_RECORDING_ACT)
      .subscribe(x => {
        this.selectedRecordingAct = x;
        this.displayRecordingActEditor = !isEmpty(this.selectedRecordingAct?.recordingAct);
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


  onRecordableSubjectTabbedViewEvent(event) {
    switch (event.type as RecordableSubjectTabbedViewEventType) {

      case RecordableSubjectTabbedViewEventType.CLOSE_BUTTON_CLICKED:
        this.unselectCurrentRecordableSubject();
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onRecordingActUpdated() {
    this.uiLayer.dispatch(RegistrationAction.SELECT_TRANSACTION_INSTRUMENT_RECORDINGT,
      {transactionUID: this.selectedTransaction.uid});
  }


  onOptionModalClosed() {
    this.displayOptionModalSelected = null;
  }


  onCloseTransactionEditor() {
    this.unselectCurrentTransaction();
  }


  onCloseFileViewer() {
    this.unselectCurrentFile();
    this.unselectCurrentRecordableSubject();
  }


  unselectCurrentSelections(){
    this.unselectCurrentFile();
    this.unselectCurrentRecordableSubject();
    this.unselectCurrentRecordingAct();
  }


  unselectCurrentRecordableSubject() {
    this.uiLayer.dispatch(RegistrationAction.UNSELECT_RECORDABLE_SUBJECT);
  }


  unselectCurrentRecordingAct() {
    this.uiLayer.dispatch(RegistrationAction.UNSELECT_RECORDING_ACT);
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

}
