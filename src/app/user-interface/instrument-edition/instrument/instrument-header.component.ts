/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { concat, of, Subject, from, Observable } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter,
         switchMap, takeUntil, tap } from 'rxjs/operators';
import { EventInfo, isEmpty } from '@app/core';
import { FrontController, PresentationState } from '@app/core/presentation';
import { InstrumentsStateSelector, InstrumentTypesAction, InstrumentTypesStateSelector,
         IssuersAction, TransactionStateSelector } from '@app/core/presentation/state.commands';
import { Transaction, Instrument, Issuer, InstrumentTypeEnum,
         EmptyTransaction, EmptyInstrument} from '@app/domain/models';
import { InstrumentsCommandType } from '@app/core/presentation/commands';

type instrumentFormControls = 'type' | 'sheetsCount' | 'kind' | 'issueDate' | 'issuer' |
                              'instrumentNo' | 'binderNo' | 'folio' | 'endFolio' | 'summary';

@Component({
  selector: 'emp-land-instrument-header',
  templateUrl: './instrument-header.component.html'
})
export class InstrumentHeaderComponent implements OnInit, OnDestroy {
  transaction: Transaction = EmptyTransaction;
  instrument: Instrument = EmptyInstrument;

  isLoading = false;
  readonly = true;
  submitted = false;
  private unsubscribe: Subject<void> = new Subject();
  instrumentTypeEnum = InstrumentTypeEnum;

  form: FormGroup = new FormGroup({
    type: new FormControl('', Validators.required),
    sheetsCount: new FormControl(''),
    kind: new FormControl(''),
    issueDate: new FormControl(''),
    issuer: new FormControl(''),
    instrumentNo: new FormControl(''),
    binderNo: new FormControl(''),
    folio: new FormControl(''),
    endFolio: new FormControl(''),
    summary: new FormControl('')
  });

  instrumentTypesList: any[] = [
    { type: 'EscrituraPublica', typeName: 'Escritura pública' },
    { type: 'OficioNotaria', typeName: 'Oficio de notaría' },
    { type: 'DocumentoJuzgado', typeName: 'Documento de juzgado' },
    { type: 'TituloPropiedad', typeName: 'Título de propiedad' },
    { type: 'DocumentoTerceros', typeName: 'Documento de terceros' }
  ];

  issuerList$: Observable<Issuer[]>;
  issuerInput$ = new Subject<string>();
  issuerLoading = false;
  issuerMinTermLength = 5;

  instrumentKindsList: any[] = [];

  constructor(private store: PresentationState,
              private frontController: FrontController) { }

  ngOnInit(): void {
    this.store.select<Transaction>(TransactionStateSelector.SELECTED_TRANSACTION)
    .pipe(takeUntil(this.unsubscribe))
    .subscribe(x => { this.transaction = x; });

    this.store.select<Instrument>(InstrumentsStateSelector.TRANSACTION_INSTRUMENT)
    .pipe(takeUntil(this.unsubscribe))
    .subscribe(x => {
      this.instrument = !isEmpty(x) ? x : EmptyInstrument;
      this.enableEditor(false);
      this.loadInstrumentKindList(this.instrument.type);
    });

    this.store.select<string[]>(InstrumentTypesStateSelector.INSTRUMENT_KIND_LIST)
    .pipe(takeUntil(this.unsubscribe))
    .subscribe(x => {
      this.instrumentKindsList = x.map(item => { return {name: item}; });
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getFormControl(name: instrumentFormControls){
    return this.form.get(name);
  }

  enableEditor(enable: boolean){
    this.readonly = !enable;
    this.setFormModel();
    if (enable) {
      this.form.enable();
    } else {
      this.form.disable();
    }
  }

  enableEditInstrument(edit){
    if (this.instrument.status == 'Opened') {
      this.enableEditor(edit);
    } else {
      alert(`No es posible editar el documento, su estatus es ${this.instrument.status}.`)
    }
  }

  setFormModel(){
    this.form.reset({
      type: this.instrument.type,
      sheetsCount: this.instrument.sheetsCount,
      kind: this.instrument.kind,
      issueDate: this.instrument.issueDate,
      issuer: isEmpty(this.instrument.issuer) ? null : this.instrument.issuer.uid,
      instrumentNo: this.instrument.instrumentNo,
      binderNo: this.instrument.binderNo,
      folio: this.instrument.folio,
      endFolio: this.instrument.endFolio,
      summary: this.instrument.summary
    });
    this.submitted = false;
    this.subscribeIssuerList();
  }

  resetForm(resetModel){
    if (resetModel){
      this.form.patchValue({
        kind: this.instrument.kind,
        issuer: isEmpty(this.instrument.issuer) ? null : this.instrument.issuer.uid,
        instrumentNo: this.instrument.instrumentNo,
        binderNo: this.instrument.binderNo,
        folio: this.instrument.folio,
        endFolio: this.instrument.endFolio,
      });
      this.subscribeIssuerList();
    }else{
      this.getFormControl('kind').reset();
      this.getFormControl('issuer').reset();
      this.getFormControl('instrumentNo').reset();
      this.getFormControl('binderNo').reset();
      this.getFormControl('folio').reset();
      this.getFormControl('endFolio').reset();
    }
  }

  subscribeIssuerList(){
    this.issuerList$ = concat(
      of(isEmpty(this.instrument.issuer) ? [] : [this.instrument.issuer]),
      this.issuerInput$.pipe(
          filter(e => { return e !== null && e.length >= this.issuerMinTermLength }),
          distinctUntilChanged(),
          debounceTime(800),
          tap(() => this.issuerLoading = true),
          switchMap(term =>
            from( this.store.dispatch<Issuer[]>(IssuersAction.LOAD_ISSUER_LIST,
                      {
                        instrumentType: this.getFormControl('type').value,
                        instrumentKind: this.getFormControl('kind').value,
                        onDate: this.getFormControl('issueDate').value,
                        keywords: term
                      }
            ))
          .pipe(
              catchError(() => of([])),
              tap(() => this.issuerLoading = false)
          ))
      )
    );
  }

  instrumentTypeChange(change){
    this.loadInstrumentKindList(change.type);
    this.resetForm(change.type === this.instrument.type);
  }

  loadInstrumentKindList(instrumentType){
    this.isLoading = true;
    if (!instrumentType || [InstrumentTypeEnum.EscrituraPublica, InstrumentTypeEnum.TituloPropiedad]
                           .includes(instrumentType)) {
      this.instrumentKindsList = [];
      this.isLoading = false;
      return;
    }
    this.store.dispatch(InstrumentTypesAction.LOAD_INSTRUMENT_KIND_LIST, this.getFormControl('type').value);
  }

  submit() {
    if (this.form.valid && !this.submitted){
      this.submitted = true;

      const commantType = isEmpty(this.instrument) ?
        InstrumentsCommandType.CREATE_INSTRUMENT :
        InstrumentsCommandType.UPDATE_INSTRUMENT;

      const instrument = this.getFormData();

      const event: EventInfo = {
        type: commantType,
        payload: {
          transactionUID: this.transaction.uid,
          instrument: instrument
        }
      };
      console.log(event);
      this.frontController.dispatch<void>(event);
    }
  }

  getFormData() {
    const formModel = this.form.getRawValue();

    const data = {
      uid: this.instrument.uid,
      type: formModel.type,
      kind: formModel.kind ?? '',
      sheetsCount: formModel.sheetsCount,
      issueDate: formModel.issueDate,
      issuerUID: formModel.issuer ?? 'Empty',
      summary: formModel.summary,
      instrumentNo: formModel.instrumentNo,
      binderNo: formModel.binderNo,
      folio: formModel.folio,
      endFolio: formModel.endFolio
    };

    return data;
  }

  validateTypeSelected(type: InstrumentTypeEnum[]){
    return type.includes(this.getFormControl('type').value);
  }

}
