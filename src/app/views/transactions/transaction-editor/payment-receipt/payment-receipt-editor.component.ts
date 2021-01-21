import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Assertion, EventInfo } from '@app/core';
import { EmptyPayment, Payment, stringToNumber } from '@app/models';
import { FormHandler } from '@app/shared/utils';

export enum PaymentReceiptEditorEventType {
  SUBMIT_PAYMENT_RECEIPT_CLICKED = 'PaymentReceiptEditorComponent.Event.SubmitPaymentReceiptClicked',
  SUBMIT_PAYMENT_RECEIPT_AND_RECEIVE_CLICKED =
    'PaymentReceiptEditorComponent.Event.SubmitPaymentReceiptAndReceiveClicked',
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

  @Input() payment: Payment = EmptyPayment;

  @Input() canEdit: boolean = false;

  @Output() paymentReceiptEvent = new EventEmitter<EventInfo>();

  formHandler: FormHandler;

  controls = PaymentReceiptFormControls;

  eventType = PaymentReceiptEditorEventType;

  constructor(private currencyPipe: CurrencyPipe) {
    this.formHandler = new FormHandler(
      new FormGroup({
        paymentReceiptNo: new FormControl('', Validators.required),
        total: new FormControl('', Validators.required),
      })
    );
  }

  ngOnChanges(){
    this.formHandler.setFormModel({
      paymentReceiptNo: this.payment?.paymentReceiptNo,
      total: this.payment?.total ? this.currencyPipe.transform(this.payment.total) : null
    });

    this.formHandler.disableForm(!this.canEdit);
  }

  submit(eventType: PaymentReceiptEditorEventType){
    if (!this.formHandler.validateReadyForSubmit()) {
      return;
    }

    this.formHandler.submitted = true;
    this.sendEvent(eventType, this.getFormData());
  }

  private getFormData(): any {
    Assertion.assert(this.formHandler.form.valid,
      'Programming error: form must be validated before command execution.');

    const formModel = this.formHandler.form.getRawValue();

    const data: any = {
      paymentReceiptNo: formModel.paymentReceiptNo,
      total: stringToNumber(formModel.total),
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
