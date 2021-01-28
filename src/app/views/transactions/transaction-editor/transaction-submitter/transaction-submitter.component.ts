import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Assertion, EventInfo, Validate } from '@app/core';
import { EmptyPayment, PaymentFields, PaymentOrder } from '@app/models';
import { MessageBoxService } from '@app/shared/containers/message-box';
import { FormatLibrary, FormHandler } from '@app/shared/utils';

export enum TransactionSubmitterEventType {
  SET_PAYMENT_CLICKED = 'TransactionSubmitterComponent.Event.SetPaymentClicked',
  CANCEL_PAYMENT_CLICKED = 'TransactionSubmitterComponent.Event.CancelPaymentClicked',
  SUBMIT_TRANSACTION_CLICKED = 'TransactionSubmitterComponent.Event.SubmitTransactionClicked',
}

enum TransactionSubmitterFormControls  {
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

  @Input() showPaymentReceiptEditor: boolean = false;

  @Input() canEdit: boolean = false;

  @Input() canCancel: boolean = false;

  @Input() canSubmit: boolean = false;

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

  ngOnChanges(){
    this.formHandler.setFormModel({
      paymentReceiptNo: this.payment?.receiptNo,
      total: this.payment?.total ? this.currencyPipe.transform(this.payment.total) : null
    });

    this.formHandler.setControlValidators(this.controls.total,
      [Validators.required, Validate.maxCurrencyValue(this.paymentOrder.total)]);

    this.formHandler.disableForm(!this.canEdit);
  }

  setPayment(){
    if (!this.formHandler.validateReadyForSubmit()) {
      return;
    }

    this.formHandler.submitted = true;
    this.sendEvent(TransactionSubmitterEventType.SET_PAYMENT_CLICKED, this.getFormData());
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
            this.sendEvent(TransactionSubmitterEventType.CANCEL_PAYMENT_CLICKED);
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
            this.sendEvent(TransactionSubmitterEventType.SUBMIT_TRANSACTION_CLICKED);
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

  private sendEvent(eventType: TransactionSubmitterEventType, payload?: any) {
    const event: EventInfo = {
      type: eventType,
      payload
    };

    this.transactionSubmittertEvent.emit(event);
  }

}
