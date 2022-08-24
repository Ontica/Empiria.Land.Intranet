/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { CurrencyPipe } from '@angular/common';

import { Assertion, EventInfo, Validate } from '@app/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { EmptyPayment, PaymentFields, PaymentOrder } from '@app/models';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { FormatLibrary, FormHandler, sendEvent } from '@app/shared/utils';

export enum TransactionSubmitterEventType {
  SET_PAYMENT_CLICKED        = 'TransactionSubmitterComponent.Event.SetPaymentClicked',
  CANCEL_PAYMENT_CLICKED     = 'TransactionSubmitterComponent.Event.CancelPaymentClicked',
  SUBMIT_TRANSACTION_CLICKED = 'TransactionSubmitterComponent.Event.SubmitTransactionClicked',
}

enum TransactionSubmitterFormControls {
  paymentReceiptNo = 'paymentReceiptNo',
  total = 'total',
}

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

  formHandler: FormHandler;

  controls = TransactionSubmitterFormControls;

  eventType = TransactionSubmitterEventType;

  constructor(private messageBox: MessageBoxService,
              private currencyPipe: CurrencyPipe) {
    this.formHandler = new FormHandler(
      new FormGroup({
        paymentReceiptNo: new FormControl('', Validators.required),
        total: new FormControl('', Validators.required),
      })
    );
  }


  ngOnChanges() {
    this.formHandler.setFormModel({
      paymentReceiptNo: this.payment?.receiptNo,
      total: this.payment?.total ? this.currencyPipe.transform(this.payment.total) : null
    });

    // this.validateTotalField();
    this.formHandler.disableForm(!this.canEdit);
  }


  setPayment() {
    if (!this.formHandler.validateReadyForSubmit()) {
      return;
    }

    sendEvent(this.transactionSubmittertEvent,
      TransactionSubmitterEventType.SET_PAYMENT_CLICKED, this.getFormData());
  }


  cancelPayment() {
    const message = `Esta operación cancelará el registro del recibo de pago
      <strong> ${this.payment.receiptNo} </strong>
      con total de ${this.currencyPipe.transform(this.payment.total)}.
      <br><br>¿Cancelo este recibo de pago?`;

    this.messageBox.confirm(message, 'Cancelar recibo de pago', 'DeleteCancel')
      .toPromise()
      .then(x => {
        if (x) {
          sendEvent(this.transactionSubmittertEvent, TransactionSubmitterEventType.CANCEL_PAYMENT_CLICKED);
        }
      });
  }


  submitTransaction() {
    const message = `Esta operación cambiara el estatus del trámite a
    <strong> recibido </strong>.
    <br><br>¿Recibo este trámite?`;

    this.messageBox.confirm(message, 'Recibir trámite', 'AcceptCancel')
      .toPromise()
      .then(x => {
        if (x) {
          sendEvent(this.transactionSubmittertEvent,
            TransactionSubmitterEventType.SUBMIT_TRANSACTION_CLICKED);
        }
      });
  }


  private validateTotalField() {
    if (this.paymentOrder?.total) {
      this.formHandler.setControlValidators(this.controls.total,
        [Validators.required, Validate.maxCurrencyValue(this.paymentOrder.total)]);
    } else {
      this.formHandler.clearControlValidators(this.controls.total);
    }
  }


  private getFormData(): PaymentFields {
    Assertion.assert(this.formHandler.form.valid,
      'Programming error: form must be validated before command execution.');

    const formModel = this.formHandler.form.getRawValue();

    const data: PaymentFields = {
      receiptNo: formModel.paymentReceiptNo,
      total: FormatLibrary.stringToNumber(formModel.total ?? ''),
    };

    return data;
  }

}
