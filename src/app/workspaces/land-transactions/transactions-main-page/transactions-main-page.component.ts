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
         TransactionStateSelector } from '@app/core/presentation/presentation-types';

import { View } from '@app/main-layout';

import { TransactionDescriptor, Transaction, EmptyTransaction, TransactionQuery, EmptyTransactionQuery,
         mapTransactionStageFromViewName, mapTransactionStatusFromViewName, RegistryEntryData,
         EmptyRegistryEntryData, isRegistryEntryDataValid, TransactionsOperationList, LandExplorerTypes,
         TransactionViewCanReceive, TransactionViewCanCreate } from '@app/models';

import { EmptyFileViewerData, FileViewerData } from '@app/shared/form-controls/file-control/file-control-data';

import { LandExplorerEventType } from '@app/views/land-list/land-explorer/land-explorer.component';

import {
  RegistryEntryEditorEventType
} from '@app/views/registration/registry-entry/registry-entry-editor.component';


type TransactionModalOptions = 'CreateTransactionEditor' | 'ExecuteCommand' | 'ExecuteCommandMultiple' |
                               'ReceiveTransactions';


@Component({
  selector: 'emp-land-transactions-main-page',
  templateUrl: './transactions-main-page.component.html'
})
export class TransactionsMainPageComponent implements OnInit, OnDestroy {

  currentView: View;

  transactionsOperationList = TransactionsOperationList;

  query: TransactionQuery = EmptyTransactionQuery;
  transactionList: TransactionDescriptor[] = [];

  selectedTransaction: Transaction = EmptyTransaction;
  selectedTransactions: TransactionDescriptor[] = [];
  selectedFileViewerData: FileViewerData = EmptyFileViewerData;
  selectedRegistryEntryData: RegistryEntryData = EmptyRegistryEntryData;

  canReceiveTransactions = false;
  canCreateTransaction = false;

  displayTransactionTabbedView = false;
  displayOptionModalSelected: TransactionModalOptions = null;
  displayFileViewer = false;
  displayRegistryEntryEditor = false;

  isLoading = false;
  isLoadingTransaction = false;

  landExplorerTypes = LandExplorerTypes;

  subscriptionHelper: SubscriptionHelper;

  constructor(private uiLayer: PresentationLayer) {
    this.subscriptionHelper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit() {
    this.subscribeToTransactionListData();
    this.subscribeToCurrentView();
    this.subscribeToSelectedTransaction();
    this.suscribeToSelectedViewersData();
  }


  ngOnDestroy() {
    this.subscriptionHelper.destroy();
  }


  onTransactionExplorerEvent(event: EventInfo): void {
    switch (event.type as LandExplorerEventType) {

      case LandExplorerEventType.CREATE_ITEM_CLICKED:
        this.displayOptionModalSelected = 'CreateTransactionEditor';
        return;

      case LandExplorerEventType.RECEIVE_ITEMS_CLICKED:
        this.displayOptionModalSelected = 'ReceiveTransactions';
        return;

      case LandExplorerEventType.FILTER_CHANGED:
        this.applyTransactionsFilter(event.payload);
        return;

      case LandExplorerEventType.ITEM_SELECTED:
        this.isLoadingTransaction = true;
        this.uiLayer.dispatch(TransactionAction.SELECT_TRANSACTION,
                              { transactionUID: event.payload.item.uid });
        return;

      case LandExplorerEventType.ITEM_EXECUTE_OPERATION:
        this.displayOptionModalSelected = 'ExecuteCommand';
        this.selectedTransactions = [event.payload.item];
        return;

      case LandExplorerEventType.ITEMS_EXECUTE_OPERATION:
        this.displayOptionModalSelected = 'ExecuteCommandMultiple';
        this.selectedTransactions = event.payload.items;
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


  private subscribeToCurrentView() {
    this.subscriptionHelper.select<View>(MainUIStateSelector.CURRENT_VIEW)
      .subscribe(x => this.onCurrentViewChanged(x));
  }


  private subscribeToTransactionListData() {
    this.subscriptionHelper.select<TransactionDescriptor[]>(TransactionStateSelector.TRANSACTION_LIST)
      .subscribe(x => {
        this.transactionList = x;
        this.isLoading = false;
        this.unselectCurrentSelections();
      }, error => this.isLoading = false);

    this.subscriptionHelper.select<TransactionQuery>(TransactionStateSelector.LIST_FILTER)
      .subscribe(x => this.query = x);
  }


  private subscribeToSelectedTransaction() {
    this.subscriptionHelper.select<Transaction>(TransactionStateSelector.SELECTED_TRANSACTION)
      .subscribe(x => {
        this.selectedTransaction = x;
        this.isLoadingTransaction = false;
        this.displayTransactionTabbedView = !isEmpty(this.selectedTransaction);
        this.unselectCurrentSelections();
      }, error => this.isLoadingTransaction = false);
  }


  private suscribeToSelectedViewersData() {
    this.subscriptionHelper.select<RegistryEntryData>(RegistrationStateSelector.SELECTED_REGISTRY_ENTRY)
      .subscribe(x => this.setRegistryEntryData(x));

    this.subscriptionHelper.select<FileViewerData>(TransactionStateSelector.SELECTED_FILE_LIST)
      .subscribe(x => this.setFileViewerData(x));
  }


  private applyTransactionsFilter(data?: { keywords: string }) {
    const currentKeywords =
      this.uiLayer.selectValue<TransactionQuery>(TransactionStateSelector.LIST_FILTER).keywords;

    const filter: TransactionQuery = {
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
    this.setDisplayActionButtons();
  }


  private setDisplayActionButtons() {
    this.canReceiveTransactions = TransactionViewCanReceive.includes(this.currentView.name);
    this.canCreateTransaction = TransactionViewCanCreate.includes(this.currentView.name);
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


  private unselectRegistryEntryEditor() {
    this.uiLayer.dispatch(RegistrationAction.UNSELECT_REGISTRY_ENTRY);
  }


  private unselectCurrentSelections(){
    this.unselectCurrentFile();
    this.unselectRegistryEntryEditor();
  }

}
