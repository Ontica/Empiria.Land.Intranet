import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Assertion, Command, isEmpty } from '@app/core';
import { PresentationLayer } from '@app/core/presentation';
import { TransactionCommandType,
         TransactionStateSelector } from '@app/core/presentation/presentation-types';
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

  transactionTypeSelected: TransactionType = null;

  transactionTypeList: TransactionType[] = [];
  transactionSubtypeList: TransactionSubtype[] = [];
  agencyList: Agency[] = [];
  recorderOfficeList: RecorderOffice[] = [];

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

  constructor(private uiLayer: PresentationLayer) { }

  ngOnInit(): void { }

  ngOnChanges() {
    this.transactionTypeSelected = isEmpty(this.transaction.type) ? null : this.transaction.type;
    if (isEmpty(this.transaction)){
      this.resetForm();
    }else{
      this.setFormModel();
    }
    this.loadDataLists();
    this.disableForm();
  }

  loadDataLists(){
    this.uiLayer.select<TransactionType[]>(TransactionStateSelector.TRANSACTION_TYPE_LIST, {})
      .subscribe(x => {
        this.transactionTypeList = x;
        this.loadSubtypeList();
      });

    this.uiLayer.select<RecorderOffice[]>(TransactionStateSelector.RECORDER_OFFICE_LIST, {})
      .subscribe(x => {
        this.recorderOfficeList = isEmpty(this.transaction.recorderOffice) ?
                                  x : insertIfNotExist(x, this.transaction.recorderOffice, 'uid');
      });

    this.uiLayer.select<Agency[]>(TransactionStateSelector.AGENCY_LIST, {})
      .subscribe(x => {
        this.agencyList = isEmpty(this.transaction.agency) ?
                          x : insertIfNotExist(x, this.transaction.agency, 'uid');
      });
  }

  loadSubtypeList(){
    this.transactionSubtypeList = [];
    if (!isEmpty(this.transactionTypeSelected)) {
      const subtypeList =
        this.transactionTypeList.filter(y => y.uid === this.transactionTypeSelected.uid).length > 0 ?
        this.transactionTypeList.filter(y => y.uid === this.transactionTypeSelected.uid)[0].subtypes : [];

      this.transactionSubtypeList = insertIfNotExist(subtypeList, this.transaction.subtype, 'uid');
    }
  }

  transactionTypeChange(change: TransactionType) {
    this.transactionTypeSelected = change;
    this.transactionSubtypeList = this.transactionTypeSelected.subtypes;

    const subtypeUID = !isEmpty(this.transaction.subtype) && change.uid === this.transaction.type.uid ?
                       this.transaction.subtype.uid : null;

    this.getFormControl('subtype').reset(subtypeUID);
  }

  submit() {
    if (this.submitted || !this.form.valid) {
      this.invalidateForm(this.form);
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
        transaction: this.getFormData()
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
      type:  this.transaction.type.uid,
      subtype: isEmpty(this.transaction.subtype) ? null : this.transaction.subtype.uid,
      name: this.transaction.requestedBy.name,
      email: this.transaction.requestedBy.email,
      instrumentNo: this.transaction.instrument?.instrumentNo,
      agency: isEmpty(this.transaction.agency) ? null : this.transaction.agency.uid,
      recorderOffice: isEmpty(this.transaction.recorderOffice) ? null : this.transaction.recorderOffice.uid,
    });

    this.submitted = false;
  }

  private getFormData(): any {
    Assertion.assert(this.form.valid,
      'Programming error: form must be validated before command execution.');

    const formModel = this.form.value;

    const data = {
      typeUID: formModel.type,
      subtypeUID: formModel.subtype,
      requestedBy: (formModel.name as string).toUpperCase(),
      requestedByEmail: formModel.email ? (formModel.email as string).toLowerCase() : '',
      instrumentDescriptor: formModel.instrumentNo ? (formModel.instrumentNo as string).toUpperCase() : '',
      agencyUID: formModel.agency ?? '',
      recorderOfficeUID: formModel.recorderOffice
    };

    return data;
  }

  private resetForm() {
    this.form.reset();
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

function insertIfNotExist<T, K extends keyof T>(array: T[], item: T, key: K): T[] {
  let newArray = [... array];
  if (array.filter(element => element[key] === item[key]).length === 0) {
    newArray = [...array, ... [item]];
  }
  return newArray;
}
