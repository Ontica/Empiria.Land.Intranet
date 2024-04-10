/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';

import { CurrencyPipe } from '@angular/common';

import { Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';

import { Assertion, EventInfo, Identifiable, isEmpty } from '@app/core';

import { Agency, Transaction, EmptyTransaction, TransactionType, TransactionSubtype,
         TransactionFields } from '@app/models';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { ArrayLibrary, FormHelper, sendEvent } from '@app/shared/utils';

export enum TransactionHeaderEventType {
  SAVE_TRANSACTION         = 'TransactionHeaderComponent.Event.SaveTransactionClicked',
  CLONE_TRANSACTION        = 'TransactionHeaderComponent.Event.CloneTransactionClicked',
  DELETE_TRANSACTION       = 'TransactionHeaderComponent.Event.DeleteTransactionClicked',
  GENERATE_PAYMENT_ORDER   = 'TransactionHeaderComponent.Event.GeneratePaymentOrderClicked',
  CANCEL_PAYMENT_ORDER     = 'TransactionHeaderComponent.Event.CancelPaymentOrderClicked',
  PRINT_CONTROL_VOUCHER    = 'TransactionHeaderComponent.Event.PrintControlVoucherClicked',
  PRINT_PAYMENT_ORDER      = 'TransactionHeaderComponent.Event.PrintPaymentOrderClicked',
  PRINT_SUBMISSION_RECEIPT = 'TransactionHeaderComponent.Event.PrintSubmissionReceiptClicked',
}

interface TransactionFormModel extends FormGroup<{
  type: FormControl<string>;
  subtype: FormControl<string>;
  name: FormControl<string>;
  email: FormControl<string>;
  instrumentNo: FormControl<string>;
  agency: FormControl<string>;
  filingOffice: FormControl<string>;
  billTo: FormControl<string>;
  rfc: FormControl<string>;
}> {}

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

  form: TransactionFormModel;

  formHelper = FormHelper;

  editionMode = false;

  isLoading = false;


  constructor(private messageBox: MessageBoxService,
              private currencyPipe: CurrencyPipe) {
    this.initForm();
    this.enableEditor(true);
  }


  ngOnChanges() {
    this.enableEditor(!this.isSaved);
  }


  get isSaved(): boolean {
    return !isEmpty(this.transaction);
  }


  enableEditor(enable: boolean) {
    this.editionMode = enable;

    if (!this.editionMode) {
      this.setFormData();
    }

    this.setInitialSubtypeList();
    this.formHelper.setDisableForm(this.form, !this.editionMode);
  }


  onTransactionTypeChange(change: TransactionType) {
    this.transactionSubtypeList = change.subtypes;

    const subtypeUID = !isEmpty(this.transaction.subtype) && change.uid === this.transaction.type.uid ?
      this.transaction.subtype.uid : null;

    this.form.controls.subtype.reset(subtypeUID);
  }


  onBillingFieldsChange() {
    this.setBillingValidators();
  }


  onSubmitClicked() {
    if (this.formHelper.isFormReadyAndInvalidate(this.form)) {
      sendEvent(this.transactionHeadertEvent,
        TransactionHeaderEventType.SAVE_TRANSACTION, this.getFormData());
    }
  }


  onCloneButtonClicked() {
    const message = `Esta operación creará una copia del trámite
    <strong> ${this.transaction.transactionID} </strong>.
    <br><br>¿Creo la copia?`;

    this.messageBox.confirm(message, 'Crear una copia', 'AcceptCancel')
      .firstValue()
      .then(x => {
        if (x) {
          sendEvent(this.transactionHeadertEvent, TransactionHeaderEventType.CLONE_TRANSACTION);
        }
      });
  }


  onDeleteButtonClicked() {
    const message = `Esta operación eliminará el trámite
      <strong> ${this.transaction.transactionID}</strong>.<br><br>¿Elimino el trámite?`;

    this.messageBox.confirm(message, 'Eliminar trámite', 'DeleteCancel')
      .firstValue()
      .then(x => {
        if (x) {
          sendEvent(this.transactionHeadertEvent, TransactionHeaderEventType.DELETE_TRANSACTION);
        }
      });
  }


  onGeneratePaymentOrderButtonClicked() {
    sendEvent(this.transactionHeadertEvent, TransactionHeaderEventType.GENERATE_PAYMENT_ORDER);
  }


  onPrintControlVoucherButtonClicked() {
    sendEvent(this.transactionHeadertEvent, TransactionHeaderEventType.PRINT_CONTROL_VOUCHER);
  }


  onPrintPaymentOrderButtonClicked() {
    sendEvent(this.transactionHeadertEvent, TransactionHeaderEventType.PRINT_PAYMENT_ORDER);
  }


  onCancelPaymentOrderButtonClicked() {
    const message = `Esta operación cancelará la orden de pago con importe de
      <strong> ${this.currencyPipe.transform(this.transaction.paymentOrder.total)}</strong>.
      <br><br>¿Cancelo esta orden de pago?`;

    this.messageBox.confirm(message, 'Cancelar orden de pago', 'DeleteCancel')
      .firstValue()
      .then(x => {
        if (x) {
          sendEvent(this.transactionHeadertEvent, TransactionHeaderEventType.CANCEL_PAYMENT_ORDER);
        }
      });
  }


  onPrintSubmissionReceiptButtonClicked() {
    sendEvent(this.transactionHeadertEvent, TransactionHeaderEventType.PRINT_SUBMISSION_RECEIPT);
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      type: ['', Validators.required],
      subtype: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', Validators.email],
      instrumentNo: [''],
      agency: ['', Validators.required],
      filingOffice: ['', Validators.required],
      billTo: [''],
      rfc: [''],
    });
  }


  private setFormData() {
    this.form.reset({
      type: this.transaction.type.uid,
      subtype: isEmpty(this.transaction.subtype) ? null : this.transaction.subtype.uid,
      name: this.transaction.requestedBy.name,
      email: this.transaction.requestedBy.email,
      instrumentNo: this.transaction.instrumentDescriptor,
      agency: isEmpty(this.transaction.agency) ? null : this.transaction.agency.uid,
      filingOffice: isEmpty(this.transaction.filingOffice) ? null : this.transaction.filingOffice.uid,
      billTo: !this.transaction.billing?.billTo ? null : this.transaction.billing.billTo,
      rfc: !this.transaction.billing?.rfc ? null : this.transaction.billing.rfc,
    });

    this.setBillingValidators();
  }


  private setInitialSubtypeList() {
    this.transactionSubtypeList = [];

    if (!isEmpty(this.transaction.type)) {
      const subtypeList =
        this.transactionTypeList.find(y => y.uid === this.transaction.type.uid)?.subtypes ?? [];

      this.transactionSubtypeList = ArrayLibrary.insertIfNotExist(subtypeList,
        this.transaction.subtype, 'uid');
    }
  }


  private setBillingValidators() {
    if (!!this.form.value.billTo || !!this.form.value.rfc) {
      this.formHelper.setControlValidators(this.form.controls.billTo, Validators.required);
      this.formHelper.setControlValidators(this.form.controls.rfc,
        [Validators.required, Validators.minLength(12), Validators.maxLength(13)]);
    } else {
      this.formHelper.clearControlValidators(this.form.controls.billTo);
      this.formHelper.clearControlValidators(this.form.controls.rfc);
    }
  }


  private getFormData(): TransactionFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const formModel = this.form.getRawValue();

    const data: TransactionFields = {
      typeUID: formModel.type,
      subtypeUID: formModel.subtype,
      filingOfficeUID: formModel.filingOffice,
      agencyUID: formModel.agency,
      requestedBy: (formModel.name).toUpperCase(),
      requestedByEmail: formModel.email ? (formModel.email).toLowerCase() : '',
      instrumentDescriptor: formModel.instrumentNo ? (formModel.instrumentNo).toUpperCase() : '',
      billTo: formModel.billTo ? formModel.billTo.toUpperCase() : '',
      rfc: formModel.rfc ? formModel.rfc.toUpperCase() : '',
    };

    return data;
  }

}
