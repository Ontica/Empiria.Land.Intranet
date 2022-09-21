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
         mapTransactionStageFromViewName, mapTransactionStatusFromViewName, RegistryEntryData,
         EmptyRegistryEntryData, isRegistryEntryDataValid } from '@app/models';

import {
  EmptyFileViewerData,
  FileViewerData
} from '@app/shared/form-controls/file-control/file-control-data';

import {
  RegistryEntryEditorEventType
} from '@app/views/registration/registry-entry/registry-entry-editor.component';

import { TransactionListEventType} from '@app/views/transactions/transaction-list/transaction-list.component';


type TransactionModalOptions = 'CreateTransactionEditor' | 'ExecuteCommand' | 'ExecuteCommandMultiple' |
                               'ReceiveTransactions';


@Component({
  selector: 'emp-land-transactions-workspace',
  templateUrl: './land-transactions-workspace.component.html'
})
export class LandTransactionsWorkspaceComponent implements OnInit, OnDestroy {

  currentView: View;

  filter: TransactionFilter = EmptyTransactionFilter;
  transactionList: TransactionShortModel[] = [];

  selectedTransaction: Transaction = EmptyTransaction;
  selectedTransactions: TransactionShortModel[] = [];
  selectedFileViewerData: FileViewerData = EmptyFileViewerData;
  selectedRegistryEntryData: RegistryEntryData = EmptyRegistryEntryData;

  displayTransactionTabbedView = false;
  displayOptionModalSelected: TransactionModalOptions = null;
  displayFileViewer = false;
  displayRegistryEntryEditor = false;

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


  onRegistryEntryEditorEvent(event: EventInfo) {
    switch (event.type as RegistryEntryEditorEventType) {

      case RegistryEntryEditorEventType.CLOSE_BUTTON_CLICKED:
        this.unselectRegistryEntryEditor();
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
    this.subscriptionHelper.select<RegistryEntryData>(RegistrationStateSelector.SELECTED_REGISTRY_ENTRY)
      .subscribe(x => this.setRegistryEntryData(x));

    this.subscriptionHelper.select<FileViewerData>(TransactionStateSelector.SELECTED_FILE_LIST)
      .subscribe(x => this.setFileViewerData(x));
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


  private setRegistryEntryData(data: RegistryEntryData) {
    this.selectedRegistryEntryData = data;
    this.displayRegistryEntryEditor = isRegistryEntryDataValid(this.selectedRegistryEntryData);
  }


  private setFileViewerData(data: FileViewerData) {
    this.selectedFileViewerData = data;
    this.displayFileViewer = this.selectedFileViewerData.fileList.length > 0;
  }


  private unselectCurrentTransaction() {
    this.uiLayer.dispatch(TransactionAction.UNSELECT_TRANSACTION);
  }


  private unselectCurrentFile() {
    this.uiLayer.dispatch(TransactionAction.UNSELECT_FILE_LIST);
  }


  private unselectCurrentSelections(){
    this.unselectCurrentFile();
    this.unselectRegistryEntryEditor();
  }


  private unselectRegistryEntryEditor() {
    this.uiLayer.dispatch(RegistrationAction.UNSELECT_REGISTRY_ENTRY);
  }

}
