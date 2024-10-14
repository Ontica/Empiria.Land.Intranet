/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, OnInit, OnDestroy, ViewChild, Input, OnChanges, SimpleChanges } from '@angular/core';

import { combineLatest } from 'rxjs';

import { Command, EventInfo, Identifiable, isEmpty, isValidMediaBase, MediaBase } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { RecordableSubjectsStateSelector, TransactionCommandType,
         TransactionStateSelector } from '@app/core/presentation/presentation-types';

import { Agency, Transaction, EmptyTransaction, TransactionType, ProvidedServiceType } from '@app/models';

import { ArrayLibrary } from '@app/shared/utils';

import { FilePreviewComponent } from '@app/shared/containers/file-preview/file-preview.component';

import { TransactionHeaderEventType } from '../transaction-header/transaction-header.component';

import { TransactionSubmitterEventType } from './transaction-submitter/transaction-submitter.component';

import { RequestedServiceEditorEventType } from './requested-services/requested-service-editor.component';

import { RequestedServiceListEventType } from './requested-services/requested-service-list.component';


@Component({
  selector: 'emp-land-transaction-editor',
  templateUrl: './transaction-editor.component.html',
})
export class TransactionEditorComponent implements OnChanges, OnInit, OnDestroy {

  @ViewChild('filePreview', { static: true }) filePreview: FilePreviewComponent;

  @Input() transaction: Transaction = EmptyTransaction;

  transactionTypeList: TransactionType[] = [];

  agencyList: Agency[] = [];

  filingOfficeList: Identifiable[] = [];

  providedServiceTypeList: ProvidedServiceType[] = [];

  helper: SubscriptionHelper;

  panelAddServiceOpenState = false;

  submitted = false;

  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.transaction) {
      this.resetInitTransactionData();
    }
  }


  ngOnInit() {
    this.loadDataLists();
  }


  resetPanelState() {
    this.panelAddServiceOpenState = false;
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  onTransactionHeaderEvent(event: EventInfo): void {
    if (this.submitted) {
      return;
    }

    let payload: any = { transactionUID: this.transaction.uid };

    switch (event.type as TransactionHeaderEventType) {

      case TransactionHeaderEventType.SAVE_TRANSACTION:

        payload = {
          transactionUID: this.transaction.uid,
          transaction: event.payload
        };

        this.executeCommand(TransactionCommandType.UPDATE_TRANSACTION, payload);

        return;

      case TransactionHeaderEventType.CLONE_TRANSACTION:

        this.executeCommand(TransactionCommandType.CLONE_TRANSACTION, payload);

        return;

      case TransactionHeaderEventType.DELETE_TRANSACTION:

        this.executeCommand(TransactionCommandType.DELETE_TRANSACTION, payload);

        return;

      case TransactionHeaderEventType.GENERATE_PAYMENT_ORDER:

        this.executeCommand<Transaction>(TransactionCommandType.GENERATE_PAYMENT_ORDER, payload)
          .then(() => this.validatePrintPaymentOrder());

        return;

      case TransactionHeaderEventType.PRINT_CONTROL_VOUCHER:

        this.openfileViewer(this.transaction.controlVoucher);

        return;

      case TransactionHeaderEventType.PRINT_PAYMENT_ORDER:

        this.openfileViewer(this.transaction.paymentOrder?.media);

        return;

      case TransactionHeaderEventType.CANCEL_PAYMENT_ORDER:

        this.executeCommand(TransactionCommandType.CANCEL_PAYMENT_ORDER, payload);

        return;

      case TransactionHeaderEventType.PRINT_SUBMISSION_RECEIPT:

        this.openfileViewer(this.transaction.submissionReceipt);

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }

  onRequestedServiceEditorEvent(event: EventInfo): void {
    if (this.submitted) {
      return;
    }

    switch (event.type as RequestedServiceEditorEventType) {

      case RequestedServiceEditorEventType.SUBMIT_REQUESTED_SERVICE_CLICKED:

        const payload = {
          transactionUID: this.transaction.uid,
          requestedService: event.payload
        };

        this.executeCommand<Transaction>(TransactionCommandType.ADD_TRANSACTION_SERVICE, payload)
          .then(x => this.resetPanelState());

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }

  onRequestedServiceListEvent(event: EventInfo): void {
    if (this.submitted) {
      return;
    }

    switch (event.type as RequestedServiceListEventType) {

      case RequestedServiceListEventType.DELETE_REQUESTED_SERVICE_CLICKED:

        const payload = {
          transactionUID: this.transaction.uid,
          requestedServiceUID: event.payload
        };

        this.executeCommand(TransactionCommandType.DELETE_TRANSACTION_SERVICE, payload);

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }

  onTransactionSubmitterEvent(event: EventInfo): void {
    if (this.submitted) {
      return;
    }

    let payload: any = { transactionUID: this.transaction.uid };

    switch (event.type as TransactionSubmitterEventType) {

      case TransactionSubmitterEventType.SET_PAYMENT_CLICKED:

        payload = {
          transactionUID: this.transaction.uid,
          payment: event.payload
        };

        this.executeCommand<Transaction>(TransactionCommandType.SET_PAYMENT, payload);

        return;

      case TransactionSubmitterEventType.CANCEL_PAYMENT_CLICKED:

        this.executeCommand(TransactionCommandType.CANCEL_PAYMENT, payload);

        return;

      case TransactionSubmitterEventType.SUBMIT_TRANSACTION_CLICKED:

        this.executeCommand(TransactionCommandType.SUBMIT_TRANSACTION, payload);

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private resetInitTransactionData() {
    this.resetPanelState();
    this.insertTransactionDataIfNotExist();
  }


  private loadDataLists() {
    combineLatest([
      this.helper.select<TransactionType[]>(TransactionStateSelector.TRANSACTION_TYPE_LIST),
      this.helper.select<Identifiable[]>(RecordableSubjectsStateSelector.RECORDER_OFFICE_LIST),
      this.helper.select<Agency[]>(TransactionStateSelector.AGENCY_LIST),
      this.helper.select<ProvidedServiceType[]>(TransactionStateSelector.PROVIDED_SERVICE_LIST)
    ])
    .subscribe(([a, b, c, d]) => {
       this.transactionTypeList = a;
       this.filingOfficeList = b;
       this.agencyList = c;
       this.providedServiceTypeList = d;
       this.insertTransactionDataIfNotExist();
    });
  }


  private insertTransactionDataIfNotExist() {
    this.filingOfficeList = isEmpty(this.transaction.filingOffice) ? this.filingOfficeList :
      ArrayLibrary.insertIfNotExist(this.filingOfficeList, this.transaction.filingOffice, 'uid');

    this.agencyList = isEmpty(this.transaction.agency) ? this.agencyList :
      ArrayLibrary.insertIfNotExist(this.agencyList, this.transaction.agency, 'uid');
  }


  private executeCommand<T>(commandType: TransactionCommandType, payload?: any): Promise<T> {
    this.submitted = true;

    const command: Command = {
      type: commandType,
      payload
    };

    return this.uiLayer.execute<T>(command)
      .finally(() => this.submitted = false);
  }

  private validatePrintPaymentOrder() {
    setTimeout(() => this.openfileViewer(this.transaction.paymentOrder?.media));
  }

  private openfileViewer(file: MediaBase) {
    if (isValidMediaBase(file)) {
      console.error('Invalid file:', file)
      return;
    }
    this.filePreview.open(file.url, file.mediaType);
  }

}
