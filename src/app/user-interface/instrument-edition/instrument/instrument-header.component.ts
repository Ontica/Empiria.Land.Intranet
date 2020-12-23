/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { concat, of, Subject, from, Observable } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, skipWhile, switchMap, takeUntil, tap } from 'rxjs/operators';

import { isEmpty } from '@app/core';
import { PresentationState } from '@app/core/presentation';
import { InstrumentsStateSelector, InstrumentTypesAction, InstrumentTypesStateSelector, IssuersAction } from '@app/core/presentation/state.commands';
import { EmptyInstrument, Instrument, InstrumentTypeEnum, Issuer } from '@app/domain/models';


@Component({
  selector: 'emp-land-instrument-header',
  templateUrl: './instrument-header.component.html'
})
export class InstrumentHeaderComponent implements OnInit, OnDestroy {

  instrument: Instrument = EmptyInstrument;

  isLoading = false;
  readonly = true;
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
    summary: new FormControl({value: '', disabled: false})
  });

  instrumentTypesList: any[] = [
    { type: 'EscrituraPublica', typeName: 'Escritura pública' },
    { type: 'OficioNotaria', typeName: 'Oficio de notaría' },
    { type: 'DocumentoJuzgado', typeName: 'Documento de juzgado' },
    { type: 'TituloPropiedad', typeName: 'Título de propiedad' },
    { type: 'DocumentoTerceros', typeName: 'Documento de terceros' }
  ];

  issuerSelected: Issuer;
  issuerList$: Observable<Issuer[]>;
  issuerInput$ = new Subject<string>();
  issuerLoading = false;
  issuerMinTermLength = 5;

  instrumentKindsList: any[] = [];

  constructor(private store: PresentationState) { }

  ngOnInit(): void {
    this.subscribeInstrumentTypeChange();
    //TODO: obtener datos de store y actualizar al cambiar de tramite.
    this.store.select<Instrument>(InstrumentsStateSelector.TRANSACTION_INSTRUMENT)
    .pipe(takeUntil(this.unsubscribe))
    .subscribe(x => {
      console.log('Instrumento: ', x);

      this.instrument = !isEmpty(x) ? x : EmptyInstrument;
      this.readonly = true;
      this.disableForm(this.readonly);
      this.resetForm();
      this.loadInstrumentKindList(this.instrument.type);
      this.isLoading = false;
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

  getFormControl(name){
    return this.form.get(name);
  }

  enableEditor(){
    this.readonly = !this.readonly;
    this.resetForm();
    this.disableForm(this.readonly);
  }

  disableForm(disable: boolean){
    if (disable) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  resetForm(){
    this.issuerSelected = this.instrument.issuer;
    this.form.reset({
      type: this.instrument.type,
      sheetsCount: this.instrument.sheetsCount,
      kind: this.instrument.kind,
      issueDate: this.instrument.issueDate,
      issuer: this.instrument.issuer?.uid,
      instrumentNo: this.instrument.instrumentNo,
      binderNo: this.instrument.binderNo,
      folio: this.instrument.folio,
      endFolio: this.instrument.endFolio,
      summary: this.instrument.summary
    });
    this.subscribeIssuerList();
  }

  discardFormChanges(restart){
    if (restart){
      this.issuerSelected = this.instrument.issuer;
      this.form.patchValue({
        kind: this.instrument.kind,
        issuer: this.instrument.issuer?.uid,
        instrumentNo: this.instrument.instrumentNo,
        binderNo: this.instrument.binderNo,
        folio: this.instrument.folio,
        endFolio: this.instrument.endFolio,
      });
      this.subscribeIssuerList();
    }else{
      this.issuerSelected = null;
      this.getFormControl('kind').reset();
      this.getFormControl('issuer').reset();
      this.getFormControl('instrumentNo').reset();
      this.getFormControl('binderNo').reset();
      this.getFormControl('folio').reset();
      this.getFormControl('endFolio').reset();
    }
  }

  subscribeInstrumentTypeChange(){
    this.getFormControl('type')
        .valueChanges
        .pipe(
          takeUntil(this.unsubscribe),
          skipWhile(val=> !val)
        )
        .subscribe(value => {
          if (!this.getFormControl('kind').disabled){
            this.loadInstrumentKindList(value);
            this.discardFormChanges(value === this.instrument.type);
          }
        });
  }

  subscribeIssuerList(){
    this.issuerList$ = concat(
      of(this.instrument.issuer ? [this.instrument.issuer] : []),
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

  loadInstrumentKindList(instrumentType){
    this.isLoading = true;

    if (!instrumentType ||
        [InstrumentTypeEnum.EscrituraPublica,
         InstrumentTypeEnum.TituloPropiedad].includes(instrumentType)) {
      this.instrumentKindsList = [];
      this.isLoading = false;
      return;
    }

    this.store.dispatch(InstrumentTypesAction.LOAD_INSTRUMENT_KIND_LIST, this.getFormControl('type').value);
  }

  submit() {
    if (this.form.valid){
      this.isLoading = true;
      setTimeout(() => {
        console.log('FORM VALID = ', this.form.valid)
        console.log(this.getFormData());
        this.isLoading = false;
      }, 500);
    }
  }

  getFormData() {
    const formModel = this.form.value;

    const data = {
      uid: this.instrument.uid,
      type: formModel.type,
      kind: formModel.kind,
      sheetsCount: formModel.sheetsCount,
      issueDate: formModel.issueDate,
      issuerUID: formModel.issuer,
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

  setIssuerSelected(event){
    this.issuerSelected = event;
  }
}
