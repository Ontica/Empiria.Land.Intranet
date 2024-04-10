/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, OnDestroy, OnInit } from '@angular/core';

import { Assertion, EventInfo, Identifiable, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { RecordableSubjectsStateSelector, RegistrationAction, RegistrationStateSelector, TransactionAction,
         TransactionStateSelector } from '@app/presentation/exported.presentation.types';

import { ESignDataService, TransactionDataService } from '@app/data-services';

import { ESignRequestsQuery, EmptyESignRequestsQuery, ESignStatus, EmptyTransaction, Transaction,
         TransactionDescriptor, LandExplorerTypes, ESignStatusList, RegistryEntryData, EmptyRegistryEntryData,
         isRegistryEntryDataValid, ESignOperationType, buildESignOperationsListByESignStatus,
         RecorderOffice } from '@app/models';

import { EmptyFileViewerData,
         FileViewerData } from '@app/shared/form-controls/file-control/file-control-data';

import { LandExplorerEventType } from '@app/views/land-list/land-explorer/land-explorer.component';

import {
  RegistryEntryEditorEventType
} from '@app/views/registration/registry-entry/registry-entry-editor.component';

import { ESignModalEventType } from '@app/views/e-sign/e-sign-modal/e-sign-modal.component';

import {
  WorkflowCommanderEventType
} from '@app/views/transactions/workflow-commander/workflow-commander.component';


enum WorkflowCommanderOptions {
  ExecuteCommand         = 'ExecuteCommand',
  ExecuteCommandMultiple = 'ExecuteCommandMultiple',
  ReceiveTransactions    = 'ReceiveTransactions',
};

@Component({
  selector: 'emp-land-e-sign-main-page',
  templateUrl: './e-sign-main-page.component.html',
})
export class ESignMainPageComponent implements OnInit, OnDestroy {

  eSignStatusList = ESignStatusList;

  eSignOperationList = [];

  recorderOfficeList: RecorderOffice[] = [];

  query: ESignRequestsQuery = EmptyESignRequestsQuery;

  transactionList: TransactionDescriptor[] = [];

  selectedTransaction: Transaction = EmptyTransaction;
  selectedTransactions: TransactionDescriptor[] = [];
  selectedFileViewerData: FileViewerData = EmptyFileViewerData;
  selectedRegistryEntryData: RegistryEntryData = EmptyRegistryEntryData;

  displayTransactionTabbedView = false;
  displayWorkflowCommanderOption: WorkflowCommanderOptions = null;
  displayESignOption: Identifiable = null;
  displayFileViewer = false;
  displayRegistryEntryEditor = false;

  isLoading = false;
  isLoadingESignRequest = false;

  landExplorerTypes = LandExplorerTypes;

  WorkflowCommanderOptions = WorkflowCommanderOptions;

  subscriptionHelper: SubscriptionHelper;


  constructor(private uiLayer: PresentationLayer,
              private eSignData: ESignDataService,
              private transactionData: TransactionDataService) {
    this.subscriptionHelper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit() {
    this.buildESignOperationsListByESignStatus();
    this.subscribeToFilterData();
    this.suscribeToSelectedViewersData();
  }


  ngOnDestroy() {
    this.subscriptionHelper.destroy();
  }


  get titleWithStatus() {
    const status = this.eSignStatusList.find(x => x.uid === this.query.status);
    if (isEmpty(status)) {
      return 'Firma electrónica';
    } else {
      return `Firma electrónica <span class="tag tag-info tag-medium">${status.name}</span>`;
    }
  }


  onESignExplorerEvent(event: EventInfo) {
    switch (event.type as LandExplorerEventType) {

      case LandExplorerEventType.RECEIVE_ITEMS_CLICKED:
        this.displayWorkflowCommanderOption = WorkflowCommanderOptions.ReceiveTransactions;
        return;

      case LandExplorerEventType.FILTER_CHANGED:
        this.setESignQuery(event.payload.recorderOfficeUID ?? '',
                           event.payload.status ?? ESignStatus.Unsigned,
                           event.payload.keywords ?? '');
        this.buildESignOperationsListByESignStatus();
        this.searchESignRequestedTransactions();
        return;

      case LandExplorerEventType.ITEM_SELECTED:
        Assertion.assertValue(event.payload.item.uid, 'event.payload.item.uid');
        this.getTransaction(event.payload.item.uid);
        return;

      case LandExplorerEventType.ITEM_EXECUTE_OPERATION:
        this.displayWorkflowCommanderOption = WorkflowCommanderOptions.ExecuteCommand;
        this.selectedTransactions = [event.payload.item];
        return;

      case LandExplorerEventType.ITEMS_EXECUTE_OPERATION:
        Assertion.assertValue(event.payload.operation.uid, 'event.payload.operation.uid');
        Assertion.assertValue(event.payload.items, 'event.payload.items');
        this.validateOperationToExecute(event.payload.operation, event.payload.items);
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


  onWorkflowCommanderEvent(event: EventInfo) {
    switch (event.type as WorkflowCommanderEventType) {
      case WorkflowCommanderEventType.CLOSE_BUTTON_CLICKED:
        this.displayWorkflowCommanderOption = null;
        return;

      case WorkflowCommanderEventType.WORKFLOW_COMMAND_EXECUTED:
        this.displayWorkflowCommanderOption = null;

        this.unselectCurrentTransaction();
        this.unselectRegistryEntryEditor();

        this.searchESignRequestedTransactions();
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onESignModalEvent(event: EventInfo) {
    switch (event.type as ESignModalEventType) {

      case ESignModalEventType.CLOSE_BUTTON_CLICKED:
        this.closeESignModal();
        return;

      case ESignModalEventType.OPERATION_EXECUTED:
        this.closeESignModal();
        this.searchESignRequestedTransactions();
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onCloseTransactionEditor() {
    this.unselectCurrentTransaction();
  }


  onCloseFileViewer() {
    this.unselectCurrentFile();
  }


  private buildESignOperationsListByESignStatus() {
    this.eSignOperationList = buildESignOperationsListByESignStatus(this.query.status);
  }


  private subscribeToFilterData() {
    this.subscriptionHelper.select<RecorderOffice[]>(RecordableSubjectsStateSelector.RECORDER_OFFICE_LIST)
      .subscribe(x => {
        this.recorderOfficeList = x;
        this.setRecorderOfficeDefault();
      });
  }


  private setRecorderOfficeDefault() {
    if (this.recorderOfficeList.length > 0) {
      const defaultRecorderOfficeUID = this.recorderOfficeList[0].uid;
      this.setESignQuery(defaultRecorderOfficeUID,
                        this.query.status,
                        this.query.keywords);
      this.searchESignRequestedTransactions();
    }
  }


  private suscribeToSelectedViewersData() {
    this.subscriptionHelper.select<RegistryEntryData>(RegistrationStateSelector.SELECTED_REGISTRY_ENTRY)
      .subscribe(x => this.setRegistryEntryData(x));

    this.subscriptionHelper.select<FileViewerData>(TransactionStateSelector.SELECTED_FILE_LIST)
      .subscribe(x => this.setFileViewerData(x));
  }


  private searchESignRequestedTransactions() {
    if (!this.query.recorderOfficeUID) {
      this.transactionList = [];
      return;
    }

    this.isLoading = true;

    this.eSignData.searchESignRequestedTransactions(this.query)
      .firstValue()
      .then(x => this.transactionList = x)
      .finally(() => this.isLoading = false)
  }


  private getTransaction(transactionUID: string) {
    this.isLoadingESignRequest = true;

    this.transactionData.getTransaction(transactionUID)
      .firstValue()
      .then(x => this.setTransaction(x))
      .finally(() => this.isLoadingESignRequest = false)
  }


  private setESignQuery(recorderOfficeUID: string,
                        status: ESignStatus,
                        keywords: string) {
    this.query = { ...this.query, ...{ recorderOfficeUID, status, keywords }};
  }


  private setTransaction(transaction: Transaction) {
    this.selectedTransaction = transaction;
    this.displayTransactionTabbedView = !isEmpty(this.selectedTransaction);
    this.unselectCurrentSelections();
  }


  private setRegistryEntryData(data: RegistryEntryData) {
    this.selectedRegistryEntryData = data;
    this.displayRegistryEntryEditor = isRegistryEntryDataValid(this.selectedRegistryEntryData);
  }


  private setFileViewerData(data: FileViewerData) {
    this.selectedFileViewerData = data;
    this.displayFileViewer = this.selectedFileViewerData.fileList.length > 0;
  }


  private unselectCurrentSelections() {
    this.unselectCurrentFile();
    this.unselectRegistryEntryEditor();
  }


  private unselectCurrentTransaction() {
    this.setTransaction(EmptyTransaction);
  }


  private unselectCurrentFile() {
    this.uiLayer.dispatch(TransactionAction.UNSELECT_FILE_LIST);
  }


  private unselectRegistryEntryEditor() {
    this.uiLayer.dispatch(RegistrationAction.UNSELECT_REGISTRY_ENTRY);
  }


  private validateOperationToExecute(operation: Identifiable, transactions: TransactionDescriptor[]) {
    this.selectedTransactions = transactions;

    switch (operation.uid as ESignOperationType) {
      case ESignOperationType.UpdateStatus:
        this.displayWorkflowCommanderOption = WorkflowCommanderOptions.ExecuteCommandMultiple;
        return;

      case ESignOperationType.Sign:
      case ESignOperationType.Revoke:
      case ESignOperationType.Refuse:
      case ESignOperationType.Unrefuse:
        this.displayESignOption = operation;
        return;

      default:
        console.log(`Unhandled user interface operation ${operation}`);
        return;
    }
  }


  private closeESignModal() {
    this.displayESignOption = null;
    this.selectedTransactions = [];
  }

}
