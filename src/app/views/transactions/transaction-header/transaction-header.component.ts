import { CurrencyPipe } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Assertion, EventInfo, isEmpty } from '@app/core';
import { Transaction, EmptyTransaction, TransactionType, TransactionSubtype,
         Agency, RecorderOffice } from '@app/models';
import { MessageBoxService } from '@app/shared/containers/message-box';
import { ArrayLibrary } from '@app/shared/utils';

type transactionFormControls = 'type' | 'subtype' | 'name' | 'email' |
                              'instrumentNo' | 'agency' | 'recorderOffice';

export enum TransactionHeaderEventType {
  SAVE_TRANSACTION_CLICKED  = 'TransactionHeaderComponent.Event.SaveTransactionClicked',
  CLONE_TRANSACTION_CLICKED  = 'TransactionHeaderComponent.Event.CloneTransactionClicked',
  DELETE_TRANSACTION_CLICKED  = 'TransactionHeaderComponent.Event.DeleteTransactionClicked',
  GENERATE_PAYMENT_ORDER = 'TransactionHeaderComponent.Event.GeneratePaymentOrderClicked',
  CANCEL_PAYMENT_ORDER = 'TransactionHeaderComponent.Event.CancelPaymentOrderClicked',
}

@Component({
  selector: 'emp-land-transaction-header',
  templateUrl: './transaction-header.component.html'
})
export class TransactionHeaderComponent implements OnInit, OnChanges {

  @Input() transaction: Transaction = EmptyTransaction;

  @Input() transactionTypeList: TransactionType[] = [];

  @Input() agencyList: Agency[] = [];

  @Input() recorderOfficeList: RecorderOffice[] = [];

  @Output() transactionHeadertEvent = new EventEmitter<EventInfo>();

  transactionSubtypeList: TransactionSubtype[] = [];

  editionMode = false;
  readonly = false;
  isLoading = false;
  submitted = false;

  form: FormGroup = new FormGroup({
    type: new FormControl('', Validators.required),
    subtype: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    email: new FormControl('', Validators.email),
    instrumentNo: new FormControl(''),
    agency: new FormControl('', Validators.required),
    recorderOffice: new FormControl('', Validators.required)
  });

  get showEnableEditor() {
    return this.canEdit || this.canDelete;
  }

  get canSave() {
    return !this.editionMode || (this.editionMode && this.transaction.actions.can.edit);
  }

  get canEdit() {
    return this.transaction.actions.can.edit;
  }

  get canGeneratePaymentOrder() {
    return this.transaction.actions.can.generatePaymentOrder;
  }

  get canCancelPaymentOrder() {
    return this.transaction.actions.can.cancelPaymentOrder;
  }

  get canDelete(){
    return this.editionMode && this.transaction.actions.can.delete;
  }

  get canSubmit(){
    return this.transaction.actions.can.submit;
  }

  constructor(private messageBox: MessageBoxService,
              private currencyPipe: CurrencyPipe){ }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.transaction) {
      this.editionMode = !isEmpty(this.transaction);
      if (this.editionMode){
        this.setFormModel();
      }else{
        this.resetForm();
      }
      this.disableForm();
    }
    this.loadInitialSubtypeList();
  }

  loadInitialSubtypeList(){
    this.transactionSubtypeList = [];
    if (!isEmpty(this.transaction.type)) {

      const subtypeList =
        this.transactionTypeList.filter(y => y.uid === this.transaction.type.uid).length > 0 ?
        this.transactionTypeList.filter(y => y.uid === this.transaction.type.uid)[0].subtypes : [];

      this.transactionSubtypeList = ArrayLibrary.insertIfNotExist(subtypeList,
                                                                  this.transaction.subtype,
                                                                  'uid');
    }
  }

  transactionTypeChange(change: TransactionType) {
    this.transactionSubtypeList = change.subtypes;

    const subtypeUID = !isEmpty(this.transaction.subtype) && change.uid === this.transaction.type.uid ?
                       this.transaction.subtype.uid : null;

    this.getFormControl('subtype').reset(subtypeUID);
  }

  getFormControl(name: transactionFormControls) {
    return this.form.get(name);
  }

  toggleReadonly(){
    this.readonly = !this.readonly;
    this.disableForm();
  }

  discardChanges(){
    this.setFormModel();
    this.loadInitialSubtypeList();
    this.disableForm();
  }

  submit() {
    if (this.submitted || !this.form.valid) {
      this.invalidateForm(this.form);
      return;
    }

    this.submitted = true;

    this.sendEvent(TransactionHeaderEventType.SAVE_TRANSACTION_CLICKED, this.getFormData());
  }


  submitClone() {
    if (this.submitted) {
      return;
    }

    const message = `Esta operación creará una copia del trámite
    <strong> ${this.transaction.transactionID} </strong>.
    <br><br>¿Creo la copia?`;

    this.messageBox.confirm(message, 'Crear una copia', 'AcceptCancel')
        .toPromise()
        .then(x => {
          if (x) {
            this.submitted = true;
            this.sendEvent(TransactionHeaderEventType.CLONE_TRANSACTION_CLICKED);
          }
        });
  }

  submitDelete() {
    if (this.submitted) {
      return;
    }

    const message = `Esta operación eliminará el trámite
      <strong> ${this.transaction.transactionID}</strong>.<br><br>¿Elimino el trámite?`;

    this.messageBox.confirm(message, 'Eliminar trámite', 'DeleteCancel')
        .toPromise()
        .then(x => {
          if (x) {
            this.submitted = true;
            this.sendEvent(TransactionHeaderEventType.DELETE_TRANSACTION_CLICKED);
          }
        });
  }

  submitGeneratePaymentOrder() {
    if (this.submitted) {
      return;
    }

    this.submitted = true;

    this.sendEvent(TransactionHeaderEventType.GENERATE_PAYMENT_ORDER);
  }

  submitCancelPaymentOrder() {
    if (this.submitted) {
      return;
    }

    const message = `Esta operación cancelará la orden de pago con importe de
      <strong> ${this.currencyPipe.transform(this.transaction.paymentOrder.total)}</strong>.
      <br><br>¿Cancelo esta orden de pago?`;

    this.messageBox.confirm(message, 'Cancelar orden de pago', 'DeleteCancel')
        .toPromise()
        .then(x => {
          if (x) {
            this.submitted = true;
            this.sendEvent(TransactionHeaderEventType.CANCEL_PAYMENT_ORDER);
          }
        });
  }

  // private methods

  private sendEvent(eventType: TransactionHeaderEventType, payload?: any) {
    const event: EventInfo = {
      type: eventType,
      payload
    };

    this.transactionHeadertEvent.emit(event);
  }

  private setFormModel() {
    this.form.reset({
      type:  this.transaction.type.uid,
      subtype: isEmpty(this.transaction.subtype) ? null : this.transaction.subtype.uid,
      name: this.transaction.requestedBy.name,
      email: this.transaction.requestedBy.email,
      instrumentNo: this.transaction.instrumentDescriptor,
      agency: isEmpty(this.transaction.agency) ? null : this.transaction.agency.uid,
      recorderOffice: isEmpty(this.transaction.recorderOffice) ? null : this.transaction.recorderOffice.uid,
    });

    this.submitted = false;
    this.readonly = true;
  }

  private getFormData(): any {
    Assertion.assert(this.form.valid,
      'Programming error: form must be validated before command execution.');

    const formModel = this.form.value;

    const data = {
      typeUID: formModel.type,
      subtypeUID: formModel.subtype,
      recorderOfficeUID: formModel.recorderOffice,
      agencyUID: formModel.agency,
      requestedBy: (formModel.name as string).toUpperCase(),
      requestedByEmail: formModel.email ? (formModel.email as string).toLowerCase() : '',
      instrumentDescriptor: formModel.instrumentNo ? (formModel.instrumentNo as string).toUpperCase() : ''
    };

    return data;
  }

  private resetForm() {
    this.readonly = false;
    this.form.reset();
    this.submitted = false;
  }

  private disableForm(){
    if (this.readonly) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  private invalidateForm(form: FormGroup) {
    Object.keys(form.controls).forEach(field => {
      const control = form.get(field);
      control.markAsTouched({ onlySelf: true });
    });
  }
}