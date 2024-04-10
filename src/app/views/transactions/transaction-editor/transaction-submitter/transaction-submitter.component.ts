/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { CurrencyPipe } from '@angular/common';

import { Assertion, EventInfo, Validate } from '@app/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { EmptyPayment, PaymentFields, PaymentOrder } from '@app/models';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { FormatLibrary, FormHelper, sendEvent } from '@app/shared/utils';

export enum TransactionSubmitterEventType {
  SET_PAYMENT_CLICKED        = 'TransactionSubmitterComponent.Event.SetPaymentClicked',
  CANCEL_PAYMENT_CLICKED     = 'TransactionSubmitterComponent.Event.CancelPaymentClicked',
  SUBMIT_TRANSACTION_CLICKED = 'TransactionSubmitterComponent.Event.SubmitTransactionClicked',
}

interface TransactionSubmitterFormModel extends FormGroup<{
  paymentReceiptNo: FormControl<string>;
  total: FormControl<string>;
}> {}

@Component({
  selector: 'emp-land-transaction-submitter',
  templateUrl: './transaction-submitter.component.html',
})
export class TransactionSubmitterComponent implements OnChanges {

  @Input() paymentOrder: PaymentOrder;

  @Input() payment: PaymentFields = EmptyPayment;

  @Input() showPaymentReceiptEditor = false;

  @Input() canEdit = false;

  @Input() canCancel = false;

  @Input() canSubmit = false;

  @Output() transactionSubmittertEvent = new EventEmitter<EventInfo>();

  form: TransactionSubmitterFormModel;

  formHelper = FormHelper;

  eventType = TransactionSubmitterEventType;


  constructor(private messageBox: MessageBoxService,
              private currencyPipe: CurrencyPipe) {
    this.initForm();
  }


  ngOnChanges() {
    this.setFormData();
    // this.setTotalValidators();
    this.formHelper.setDisableForm(this.form, !this.canEdit);
  }


  onSetPaymentClicked() {
    if (this.formHelper.isFormReadyAndInvalidate(this.form)) {
      sendEvent(this.transactionSubmittertEvent,
        TransactionSubmitterEventType.SET_PAYMENT_CLICKED, this.getFormData());
    }
  }


  onCancelPaymentClicked() {
    const message = `Esta operación cancelará el registro del recibo de pago
      <strong> ${this.payment.receiptNo} </strong>
      con total de ${this.currencyPipe.transform(this.payment.total)}.
      <br><br>¿Cancelo este recibo de pago?`;

    this.messageBox.confirm(message, 'Cancelar recibo de pago', 'DeleteCancel')
      .firstValue()
      .then(x => {
        if (x) {
          sendEvent(this.transactionSubmittertEvent, TransactionSubmitterEventType.CANCEL_PAYMENT_CLICKED);
        }
      });
  }


  onSubmitTransactionClicked() {
    const message = `Esta operación cambiara el estatus del trámite a
    <strong> recibido </strong>.
    <br><br>¿Recibo este trámite?`;

    this.messageBox.confirm(message, 'Recibir trámite', 'AcceptCancel')
      .firstValue()
      .then(x => {
        if (x) {
          sendEvent(this.transactionSubmittertEvent,
            TransactionSubmitterEventType.SUBMIT_TRANSACTION_CLICKED);
        }
      });
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      paymentReceiptNo: ['', Validators.required],
      total: ['', Validators.required],
    });
  }


  private setFormData() {
    this.form.reset({
      paymentReceiptNo: this.payment?.receiptNo,
      total: this.payment?.total ? this.currencyPipe.transform(this.payment.total) : null
    });
  }


  private setTotalValidators() {
    if (this.paymentOrder?.total) {
      const validators = [Validators.required, Validate.maxCurrencyValue(this.paymentOrder.total)];
      this.formHelper.setControlValidators(this.form.controls.total, validators);
    } else {
      this.formHelper.clearControlValidators(this.form.controls.total);
    }
  }


  private getFormData(): PaymentFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const formModel = this.form.getRawValue();

    const data: PaymentFields = {
      receiptNo: formModel.paymentReceiptNo,
      total: FormatLibrary.stringToNumber(formModel.total ?? ''),
    };

    return data;
  }

}
