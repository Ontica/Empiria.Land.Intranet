import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Assertion, EventInfo } from '@app/core';
import { EmptyPayment, PaymentFields } from '@app/models';
import { MessageBoxService } from '@app/shared/containers/message-box';
import { FormatLibrary, FormHandler } from '@app/shared/utils';

export enum PaymentReceiptEditorEventType {
  SET_PAYMENT_CLICKED = 'PaymentReceiptEditorComponent.Event.SetPaymentClicked',
  CANCEL_PAYMENT_CLICKED = 'PaymentReceiptEditorComponent.Event.CancelPaymentClicked',
  SUBMIT_TRANSACTION_CLICKED = 'PaymentReceiptEditorComponent.Event.SubmitTransactionClicked',
}

enum PaymentReceiptFormControls  {
  paymentReceiptNo = 'paymentReceiptNo',
  total = 'total',
}

@Component({
  selector: 'emp-land-payment-receipt-editor',
  templateUrl: './payment-receipt-editor.component.html',
})
export class PaymentReceiptEditorComponent implements OnChanges {

  @Input() payment: PaymentFields = EmptyPayment;

  @Input() canEdit: boolean = false;

  @Input() canCancel: boolean = false;

  @Input() canSubmitTransaction: boolean = false;

  @Output() paymentReceiptEvent = new EventEmitter<EventInfo>();

  formHandler: FormHandler;

  controls = PaymentReceiptFormControls;

  eventType = PaymentReceiptEditorEventType;

  constructor(private messageBox: MessageBoxService,
              private currencyPipe: CurrencyPipe) {
    this.formHandler = new FormHandler(
      new FormGroup({
        paymentReceiptNo: new FormControl('', Validators.required),
        total: new FormControl('', Validators.required),
      })
    );
  }

  ngOnChanges(){
    this.formHandler.setFormModel({
      paymentReceiptNo: this.payment?.receiptNo,
      total: this.payment?.total ? this.currencyPipe.transform(this.payment.total) : null
    });

    this.formHandler.disableForm(!this.canEdit);
  }

  setPayment(){
    if (!this.formHandler.validateReadyForSubmit()) {
      return;
    }

    this.formHandler.submitted = true;
    this.sendEvent(PaymentReceiptEditorEventType.SET_PAYMENT_CLICKED, this.getFormData());
  }

  cancelPayment(){
    if (this.formHandler.submitted) {
      return;
    }

    const message = `Esta operación cancelará el registro del recibo de pago
      <strong> ${this.payment.receiptNo} </strong>
      con total de ${this.currencyPipe.transform(this.payment.total)}.
      <br><br>¿Cancelo este recibo de pago?`;

    this.messageBox.confirm(message, 'Cancelar recibo de pago', 'DeleteCancel')
        .toPromise()
        .then(x => {
          if (x) {
            this.formHandler.submitted = true;
            this.sendEvent(PaymentReceiptEditorEventType.CANCEL_PAYMENT_CLICKED);
          }
        });
  }

  submitTransaction(){
    if (this.formHandler.submitted) {
      return;
    }

    const message = `Esta operación cambiara el estatus del trámite a
    <strong> recibido </strong>.
    <br><br>¿Recibo este trámite?`;

    this.messageBox.confirm(message, 'Recibir trámite', 'AcceptCancel')
        .toPromise()
        .then(x => {
          if (x) {
            this.formHandler.submitted = true;
            this.sendEvent(PaymentReceiptEditorEventType.SUBMIT_TRANSACTION_CLICKED);
          }
        });
  }

  private getFormData(): any {
    Assertion.assert(this.formHandler.form.valid,
      'Programming error: form must be validated before command execution.');

    const formModel = this.formHandler.form.getRawValue();

    const data: PaymentFields = {
      receiptNo: formModel.paymentReceiptNo,
      total: FormatLibrary.stringToNumber(formModel.total),
    };

    return data;
  }

  private sendEvent(eventType: PaymentReceiptEditorEventType, payload?: any) {
    const event: EventInfo = {
      type: eventType,
      payload
    };

    this.paymentReceiptEvent.emit(event);
  }

}
