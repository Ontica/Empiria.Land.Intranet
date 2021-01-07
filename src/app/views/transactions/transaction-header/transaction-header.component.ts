import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Assertion, Command, isEmpty } from '@app/core';
import { TransactionCommandType } from '@app/core/presentation/presentation-types';
import { Transaction, EmptyTransaction, TransactionTypeEnum,
         TransactionType, TransactionSubtype, Agency, RecorderOffice } from '@app/models';


type transactionFormControls = 'type' | 'subtype' | 'name' | 'email' |
                              'instrumentNo' | 'agency' | 'recorderOffice';


@Component({
  selector: 'emp-land-transaction-header',
  templateUrl: './transaction-header.component.html'
})
export class TransactionHeaderComponent implements OnInit, OnChanges {

  @Input() transaction: Transaction = EmptyTransaction;

  @Input() readonly = false;

  TransactionType = TransactionTypeEnum;

  transactionTypesList: TransactionType[] = [];
  transactionSubtypesList: TransactionSubtype[] = [];
  agencyList: Agency[] = [];
  recorderOfficesList: RecorderOffice[] = [];

  isLoading = false;
  submitted = false;

  form: FormGroup = new FormGroup({
    type: new FormControl('', Validators.required),
    subtype: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    email: new FormControl('', Validators.email),
    instrumentNo: new FormControl(''),
    agency: new FormControl(''),
    recorderOffice: new FormControl('', Validators.required)
  });

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges() {
    if (isEmpty(this.transaction)){
      this.resetForm();
    }else{
      this.setFormModel();
    }
  }

  transactionTypeChange(change) {
    this.getFormControl('subtype').reset();
  }

  submit() {
    if (this.submitted || !this.form.valid) {
      return;
    }

    this.submitted = true;

    let commandType = TransactionCommandType.UPDATE_TRANSACTION;
    if (isEmpty(this.transaction)) {
      commandType = TransactionCommandType.CREATE_TRANSACTION;
    }

    const command: Command = {
      type: commandType,
      payload: {
        transactionUID: this.transaction.uid,
        instrument: this.getFormData()
      }
    };

    console.log(command);
    // this.uiLayer.execute(command);
  }

  getFormControl(name: transactionFormControls) {
    return this.form.get(name);
  }

  private setFormModel() {
    this.form.reset({
      type: this.transaction.type.uid,
      subtype: this.transaction.subtype.uid,
      name: this.transaction.requestedBy.name,
      email: this.transaction.requestedBy.email,
      instrumentNo: this.transaction.instrument?.instrumentNo,
      agency: this.transaction.agency.uid,
      recorderOffice: this.transaction.recorderOffice.uid,
    });
    this.submitted = false;
  }

  private getFormData(): any {
    Assertion.assert(this.form.valid,
      'Programming error: form must be validated before command execution.');

    const formModel = this.form.value;

    const data = {
      type: formModel.type,
      subtype: formModel.subtype,
      name: (formModel.name as string).toUpperCase(),
      email: (formModel.email as string).toLowerCase(),
      instrumentNo: (formModel.instrumentNo as string).toUpperCase(),
      agency: formModel.agency,
      recorderOffice: formModel.recorderOffice
    };

    return data;
  }

  private resetForm() {
    this.form.reset();

    if (this.readonly) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

}
