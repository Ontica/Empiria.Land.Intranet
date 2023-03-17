/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

import { CurrencyPipe } from '@angular/common';

import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';

import { Assertion, EventInfo, Identifiable, isEmpty } from '@app/core';

import { Agency, Transaction, EmptyTransaction, TransactionType, TransactionSubtype } from '@app/models';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { ArrayLibrary, FormHandler, sendEvent } from '@app/shared/utils';

export enum TransactionHeaderEventType {
  SAVE_TRANSACTION_CLICKED   = 'TransactionHeaderComponent.Event.SaveTransactionClicked',
  CLONE_TRANSACTION_CLICKED  = 'TransactionHeaderComponent.Event.CloneTransactionClicked',
  DELETE_TRANSACTION_CLICKED = 'TransactionHeaderComponent.Event.DeleteTransactionClicked',
  GENERATE_PAYMENT_ORDER     = 'TransactionHeaderComponent.Event.GeneratePaymentOrderClicked',
  CANCEL_PAYMENT_ORDER       = 'TransactionHeaderComponent.Event.CancelPaymentOrderClicked',
  PRINT_CONTROL_VOUCHER      = 'TransactionHeaderComponent.Event.PrintControlVoucherClicked',
  PRINT_PAYMENT_ORDER        = 'TransactionHeaderComponent.Event.PrintPaymentOrderClicked',
  PRINT_SUBMISSION_RECEIPT   = 'TransactionHeaderComponent.Event.PrintSubmissionReceiptClicked',
}

enum TransactionHeaderFormControls {
  type = 'type',
  subtype = 'subtype',
  name = 'name',
  email = 'email',
  instrumentNo = 'instrumentNo',
  agency = 'agency',
  filingOffice = 'filingOffice',
}

@Component({
  selector: 'emp-land-transaction-header',
  templateUrl: './transaction-header.component.html'
})
export class TransactionHeaderComponent implements OnChanges {

  @Input() transaction: Transaction = EmptyTransaction;

  @Input() transactionTypeList: TransactionType[] = [];

  @Input() agencyList: Agency[] = [];

  @Input() filingOfficeList: Identifiable[] = [];

  @Output() transactionHeadertEvent = new EventEmitter<EventInfo>();

  transactionSubtypeList: TransactionSubtype[] = [];

  formHandler: FormHandler;

  controls = TransactionHeaderFormControls;

  editionMode = false;

  readonly = false;

  isLoading = false;

  constructor(private messageBox: MessageBoxService,
              private currencyPipe: CurrencyPipe) {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.transaction) {
      this.enableEditor();
    }

    this.loadInitialSubtypeList();
  }


  transactionTypeChange(change: TransactionType) {
    this.transactionSubtypeList = change.subtypes;

    const subtypeUID = !isEmpty(this.transaction.subtype) && change.uid === this.transaction.type.uid ?
      this.transaction.subtype.uid : null;

    this.formHandler.getControl(this.controls.subtype).reset(subtypeUID);
  }

  toggleReadonly() {
    this.readonly = !this.readonly;
    this.formHandler.disableForm(this.readonly);
  }

  discardChanges() {
    this.setFormModel();
    this.loadInitialSubtypeList();
    this.formHandler.disableForm(this.readonly);
  }

  submit() {
    if (!this.formHandler.validateReadyForSubmit()) {
      return;
    }

    sendEvent(this.transactionHeadertEvent,
      TransactionHeaderEventType.SAVE_TRANSACTION_CLICKED, this.getFormData());
  }


  submitClone() {
    const message = `Esta operación creará una copia del trámite
    <strong> ${this.transaction.transactionID} </strong>.
    <br><br>¿Creo la copia?`;

    this.messageBox.confirm(message, 'Crear una copia', 'AcceptCancel')
      .toPromise()
      .then(x => {
        if (x) {
          sendEvent(this.transactionHeadertEvent, TransactionHeaderEventType.CLONE_TRANSACTION_CLICKED);
        }
      });
  }


  submitDelete() {
    const message = `Esta operación eliminará el trámite
      <strong> ${this.transaction.transactionID}</strong>.<br><br>¿Elimino el trámite?`;

    this.messageBox.confirm(message, 'Eliminar trámite', 'DeleteCancel')
      .toPromise()
      .then(x => {
        if (x) {
          sendEvent(this.transactionHeadertEvent, TransactionHeaderEventType.DELETE_TRANSACTION_CLICKED);
        }
      });
  }


  submitGeneratePaymentOrder() {
    sendEvent(this.transactionHeadertEvent, TransactionHeaderEventType.GENERATE_PAYMENT_ORDER);
  }


  submitPrintControlVoucher() {
    sendEvent(this.transactionHeadertEvent, TransactionHeaderEventType.PRINT_CONTROL_VOUCHER);
  }


  submitPrintPaymentOrder() {
    sendEvent(this.transactionHeadertEvent, TransactionHeaderEventType.PRINT_PAYMENT_ORDER);
  }


  submitCancelPaymentOrder() {
    const message = `Esta operación cancelará la orden de pago con importe de
      <strong> ${this.currencyPipe.transform(this.transaction.paymentOrder.total)}</strong>.
      <br><br>¿Cancelo esta orden de pago?`;

    this.messageBox.confirm(message, 'Cancelar orden de pago', 'DeleteCancel')
      .toPromise()
      .then(x => {
        if (x) {
          sendEvent(this.transactionHeadertEvent, TransactionHeaderEventType.CANCEL_PAYMENT_ORDER);
        }
      });
  }


  submitPrintSubmissionReceipt() {
    sendEvent(this.transactionHeadertEvent, TransactionHeaderEventType.PRINT_SUBMISSION_RECEIPT);
  }

  // private methods

  private initForm() {
    if (this.formHandler) {
      return;
    }

    this.formHandler = new FormHandler(
      new UntypedFormGroup({
        type: new UntypedFormControl('', Validators.required),
        subtype: new UntypedFormControl('', Validators.required),
        name: new UntypedFormControl('', Validators.required),
        email: new UntypedFormControl('', Validators.email),
        instrumentNo: new UntypedFormControl(''),
        agency: new UntypedFormControl('', Validators.required),
        filingOffice: new UntypedFormControl('', Validators.required)
      })
    );
  }


  private setFormModel() {
    this.formHandler.form.reset({
      type: this.transaction.type.uid,
      subtype: isEmpty(this.transaction.subtype) ? null : this.transaction.subtype.uid,
      name: this.transaction.requestedBy.name,
      email: this.transaction.requestedBy.email,
      instrumentNo: this.transaction.instrumentDescriptor,
      agency: isEmpty(this.transaction.agency) ? null : this.transaction.agency.uid,
      filingOffice: isEmpty(this.transaction.filingOffice) ? null : this.transaction.filingOffice.uid,
    });

    this.readonly = true;
  }


  private getFormData(): any {
    Assertion.assert(this.formHandler.form.valid,
      'Programming error: form must be validated before command execution.');

    const formModel = this.formHandler.form.value;

    const data = {
      typeUID: formModel.type,
      subtypeUID: formModel.subtype,
      filingOfficeUID: formModel.filingOffice,
      agencyUID: formModel.agency,
      requestedBy: (formModel.name as string).toUpperCase(),
      requestedByEmail: formModel.email ? (formModel.email as string).toLowerCase() : '',
      instrumentDescriptor: formModel.instrumentNo ? (formModel.instrumentNo as string).toUpperCase() : ''
    };

    return data;
  }


  private enableEditor() {
    this.editionMode = !isEmpty(this.transaction);
    if (this.editionMode) {
      this.setFormModel();
    } else {
      this.resetForm();
    }
    this.formHandler.disableForm(this.readonly);
  }


  private loadInitialSubtypeList() {
    this.transactionSubtypeList = [];
    if (!isEmpty(this.transaction.type)) {
      const subtypeList =
        this.transactionTypeList.filter(y => y.uid === this.transaction.type.uid).length > 0 ?
          this.transactionTypeList.filter(y => y.uid === this.transaction.type.uid)[0].subtypes : [];

      this.transactionSubtypeList = ArrayLibrary.insertIfNotExist(subtypeList,
        this.transaction.subtype, 'uid');
    }
  }


  private resetForm() {
    this.readonly = false;
    this.formHandler.form.reset();
  }

}
