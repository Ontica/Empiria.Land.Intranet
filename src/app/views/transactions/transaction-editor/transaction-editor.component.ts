/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { Command, EventInfo, isEmpty } from '@app/core';
import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { TransactionCommandType, TransactionStateSelector } from '@app/core/presentation/presentation-types';

import {
  Transaction, EmptyTransaction, TransactionType, Agency, RecorderOffice,
  ProvidedServiceType
} from '@app/models';

import { FilePrintPreviewComponent } from '@app/shared/form-controls/file-print-preview/file-print-preview.component';
import { ArrayLibrary } from '@app/shared/utils';

import { TransactionHeaderEventType } from '../transaction-header/transaction-header.component';
import { TransactionSubmitterEventType } from './transaction-submitter/transaction-submitter.component';
import { RequestedServiceEditorEventType } from './requested-services/requested-service-editor.component';
import { RequestedServiceListEventType } from './requested-services/requested-service-list.component';


@Component({
  selector: 'emp-land-transaction-editor',
  templateUrl: './transaction-editor.component.html',
})
export class TransactionEditorComponent implements OnInit, OnDestroy {

  @ViewChild('filePrintPreview', { static: true }) filePrintPreview: FilePrintPreviewComponent;

  transaction: Transaction = EmptyTransaction;

  transactionTypeList: TransactionType[] = [];

  agencyList: Agency[] = [];

  recorderOfficeList: RecorderOffice[] = [];

  providedServiceTypeList: ProvidedServiceType[] = [];

  helper: SubscriptionHelper;

  panelAddServiceOpenState = false;

  submitted = false;

  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit() {
    this.helper.select<Transaction>(TransactionStateSelector.SELECTED_TRANSACTION)
      .subscribe(x => {
        this.transaction = x;
        this.resetPanelState();
        this.loadDataLists();
      });
  }


  resetPanelState() {
    this.panelAddServiceOpenState = false;
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  loadDataLists() {
    this.helper.select<TransactionType[]>(TransactionStateSelector.TRANSACTION_TYPE_LIST, {})
      .subscribe(x => {
        this.transactionTypeList = x;
      });

    this.helper.select<RecorderOffice[]>(TransactionStateSelector.RECORDER_OFFICE_LIST, {})
      .subscribe(x => {
        this.recorderOfficeList = isEmpty(this.transaction.recorderOffice) ? x :
          ArrayLibrary.insertIfNotExist(x, this.transaction.recorderOffice, 'uid');
      });

    this.helper.select<Agency[]>(TransactionStateSelector.AGENCY_LIST, {})
      .subscribe(x => {
        this.agencyList = isEmpty(this.transaction.agency) ?
          x : ArrayLibrary.insertIfNotExist(x, this.transaction.agency, 'uid');
      });

    this.helper.select<ProvidedServiceType[]>(TransactionStateSelector.PROVIDED_SERVICE_LIST, {})
      .subscribe(x => {
        this.providedServiceTypeList = x;
      });
  }


  onTransactionHeaderEvent(event: EventInfo): void {
    if (this.submitted) {
      return;
    }

    let payload: any = { transactionUID: this.transaction.uid };

    switch (event.type as TransactionHeaderEventType) {

      case TransactionHeaderEventType.SAVE_TRANSACTION_CLICKED:

        payload = {
          transactionUID: this.transaction.uid,
          transaction: event.payload
        };

        this.executeCommand(TransactionCommandType.UPDATE_TRANSACTION, payload);

        return;

      case TransactionHeaderEventType.CLONE_TRANSACTION_CLICKED:

        this.executeCommand(TransactionCommandType.CLONE_TRANSACTION, payload);

        return;

      case TransactionHeaderEventType.DELETE_TRANSACTION_CLICKED:

        this.executeCommand(TransactionCommandType.DELETE_TRANSACTION, payload);

        return;

      case TransactionHeaderEventType.GENERATE_PAYMENT_ORDER:

        this.executeCommand<Transaction>(TransactionCommandType.GENERATE_PAYMENT_ORDER, payload)
          .then(x => {
            if (x.paymentOrder?.attributes.url) {
              this.printPaymentOrder();
            }
          });

        return;

      case TransactionHeaderEventType.PRINT_PAYMENT_ORDER:

        this.printPaymentOrder();

        return;

      case TransactionHeaderEventType.CANCEL_PAYMENT_ORDER:

        this.executeCommand(TransactionCommandType.CANCEL_PAYMENT_ORDER, payload);

        return;

      case TransactionHeaderEventType.PRINT_SUBMISSION_RECEIPT:

        this.printSubmissionReceipt();

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

  private executeCommand<T>(commandType: TransactionCommandType, payload?: any): Promise<T> {
    this.submitted = true;

    const command: Command = {
      type: commandType,
      payload
    };

    return this.uiLayer.execute<T>(command)
      .finally(() => this.submitted = false);
  }

  printPaymentOrder() {
    this.openPrintViewer(this.transaction.paymentOrder.attributes.url,
      this.transaction.paymentOrder.attributes.mediaType);
  }

  printSubmissionReceipt() {
    this.openPrintViewer(this.transaction.submissionReceipt.url,
      this.transaction.submissionReceipt.mediaType);
  }

  openPrintViewer(url: string, mediaType: string) {
    this.filePrintPreview.open(url, mediaType);
  }

}
