/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, OnInit, OnDestroy } from '@angular/core';

import { EventInfo, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { MainUIStateSelector, RecordableSubjectsStateSelector, RegistrationAction, RegistrationStateSelector,
         TransactionAction, TransactionStateSelector } from '@app/core/presentation/presentation-types';

import { View } from '@app/main-layout';

import { TransactionDescriptor, Transaction, EmptyTransaction, TransactionQuery, EmptyTransactionQuery,
         mapTransactionStageFromViewName, mapTransactionStatusFromViewName, RegistryEntryData,
         EmptyRegistryEntryData, isRegistryEntryDataValid, TransactionsOperationList, LandExplorerTypes,
         TransactionViewCanReceive, TransactionViewCanCreate, RecorderOffice } from '@app/models';

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
  recorderOfficeList: RecorderOffice[] = [];

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
    this.subscribeToTransactionExplorerData();
    this.subscribeToCurrentView();
    this.subscribeToSelectedTransaction();
    this.suscribeToSelectedViewersData();
  }


  ngOnDestroy() {
    this.subscriptionHelper.destroy();
  }


  onTransactionExplorerEvent(event: EventInfo) {
    switch (event.type as LandExplorerEventType) {

      case LandExplorerEventType.CREATE_ITEM_CLICKED:
        this.displayOptionModalSelected = 'CreateTransactionEditor';
        return;

      case LandExplorerEventType.RECEIVE_ITEMS_CLICKED:
        this.displayOptionModalSelected = 'ReceiveTransactions';
        return;

      case LandExplorerEventType.FILTER_CHANGED:
        this.setTransactionsQuery(event.payload.recorderOfficeUID ?? '',
                                  event.payload.keywords ?? '');
        this.applyTransactionsQuery();
        return;

      case LandExplorerEventType.ITEM_SELECTED:
        this.isLoadingTransaction = true;
        this.uiLayer.dispatch(TransactionAction.SELECT_TRANSACTION, {transactionUID: event.payload.item.uid});
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


  private subscribeToTransactionExplorerData() {
    this.subscriptionHelper.select<TransactionDescriptor[]>(TransactionStateSelector.TRANSACTION_LIST)
      .subscribe(x => {
        this.transactionList = x;
        this.isLoading = false;
        this.unselectCurrentSelections();
      }, error => this.isLoading = false);

    this.subscriptionHelper.select<TransactionQuery>(TransactionStateSelector.LIST_FILTER)
      .subscribe(x => this.query = x);

    this.subscriptionHelper.select<RecorderOffice[]>(RecordableSubjectsStateSelector.RECORDER_OFFICE_LIST)
      .subscribe(x => {
        this.recorderOfficeList = x;
        this.setRecorderOfficeDefault();
      });
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


  private setTransactionsQuery(recorderOfficeUID?: string, keywords?: string) {
    const currentRecorderOfficeUID =
      this.uiLayer.selectValue<TransactionQuery>(TransactionStateSelector.LIST_FILTER).recorderOfficeUID;

    const currentKeywords =
      this.uiLayer.selectValue<TransactionQuery>(TransactionStateSelector.LIST_FILTER).keywords;

    const query: TransactionQuery = {
      recorderOfficeUID: recorderOfficeUID ?? currentRecorderOfficeUID,
      stage: mapTransactionStageFromViewName(this.currentView?.name),
      status: mapTransactionStatusFromViewName(this.currentView?.name),
      keywords: keywords ?? currentKeywords,
    };

    this.query = query;
  }


  private applyTransactionsQuery() {
    if (this.isValidTransactionQuery()) {
      this.isLoading = true;
      this.uiLayer.dispatch(TransactionAction.SET_LIST_FILTER, { filter: this.query });
    }
  }


  private isValidTransactionQuery(): boolean {
    return !!this.query.recorderOfficeUID && !!this.currentView?.name;
  }


  private onCurrentViewChanged(newView: View) {
    this.currentView = newView;
    this.setTransactionsQuery(this.query.recorderOfficeUID, this.query.keywords);
    this.applyTransactionsQuery();
    this.setDisplayActionButtons();
  }


  private setRecorderOfficeDefault() {
    if (!this.query.recorderOfficeUID) {
      const recorderOfficeUID = this.recorderOfficeList.length > 0 ? this.recorderOfficeList[0].uid : null;
      this.query = { ...this.query, recorderOfficeUID };
      this.applyTransactionsQuery();
    }
  }


  private setDisplayActionButtons() {
    this.canReceiveTransactions = TransactionViewCanReceive.includes(this.currentView?.name);
    this.canCreateTransaction = TransactionViewCanCreate.includes(this.currentView?.name);
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
