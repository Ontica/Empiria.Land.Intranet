/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { concat, of, Subject, Observable } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter,
         switchMap, take, tap } from 'rxjs/operators';

import { isEmpty, Validate } from '@app/core';
import { Command, PresentationLayer } from '@app/core/presentation';

import { RecordableSubjectsStateSelector,
         InstrumentsCommandType } from '@app/core/presentation/presentation-types';

import { Instrument, InstrumentTypeEnum, InstrumentTypesList,
         Issuer, IssuersFilter, EmptyInstrument} from '@app/models';

import {
  FilePrintPreviewComponent
} from '@app/shared/form-controls/file-print-preview/file-print-preview.component';


type instrumentFormControls = 'type' | 'sheetsCount' | 'kind' | 'issueDate' | 'issuer' |
                              'instrumentNo' | 'binderNo' | 'folio' | 'endFolio' | 'summary';


@Component({
  selector: 'emp-land-instrument-editor',
  templateUrl: './instrument-editor.component.html'
})
export class InstrumentEditorComponent implements OnChanges {

  @ViewChild('filePrintPreview', {static: true}) filePrintPreview: FilePrintPreviewComponent;

  @Input() transactionUID: string = 'Empty';

  @Input() instrument: Instrument = EmptyInstrument;

  InstrumentType = InstrumentTypeEnum;

  instrumentTypesList = InstrumentTypesList;

  isLoading = false;
  readonly = true;
  submitted = false;

  form: FormGroup = new FormGroup({
    type: new FormControl('', Validators.required),
    sheetsCount: new FormControl('', [Validators.required, Validate.isPositive]),
    kind: new FormControl(''),
    issueDate: new FormControl(''),
    issuer: new FormControl(''),
    instrumentNo: new FormControl(''),
    binderNo: new FormControl(''),
    folio: new FormControl(''),
    endFolio: new FormControl(''),
    summary: new FormControl('')
  });

  instrumentKindsList: any[] = [];

  issuerList$: Observable<Issuer[]>;
  issuerInput$ = new Subject<string>();
  issuerLoading = false;
  issuerMinTermLength = 5;

  constructor(private uiLayer: PresentationLayer) { }

  ngOnChanges(): void {
    this.enableEditor(false);
    this.loadInstrumentKindList(this.instrument.type);
  }

  enableEditor(enable: boolean) {
    this.readonly = !enable;
    this.setFormModel();
    if (enable) {
      this.form.enable();
    } else {
      this.form.disable();
    }
  }

  getFormControl(name: instrumentFormControls) {
    return this.form.get(name);
  }

  setFormModel() {
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

  resetForm(resetModel) {
    if (resetModel) {
      this.form.patchValue({
        kind: this.instrument.kind,
        issuer: isEmpty(this.instrument.issuer) ? null : this.instrument.issuer.uid,
        instrumentNo: this.instrument.instrumentNo,
        binderNo: this.instrument.binderNo,
        folio: this.instrument.folio,
        endFolio: this.instrument.endFolio,
      });
      this.subscribeIssuerList();
    } else {
      this.getFormControl('kind').reset();
      this.getFormControl('issuer').reset();
      this.getFormControl('instrumentNo').reset();
      this.getFormControl('binderNo').reset();
      this.getFormControl('folio').reset();
      this.getFormControl('endFolio').reset();
    }
  }

  instrumentTypeChange(change) {
    this.loadInstrumentKindList(change.type);
    this.resetForm(change.type === this.instrument.type);
  }

  validateTypeSelected(instrumentTypesArray: InstrumentTypeEnum[]) {
    return instrumentTypesArray.includes(this.getFormControl('type').value);
  }

  submit() {
    if (this.submitted || !this.form.valid) {
      return;
    }

    this.submitted = true;

    let commandType = InstrumentsCommandType.UPDATE_INSTRUMENT;
    if (isEmpty(this.instrument)) {
      commandType = InstrumentsCommandType.CREATE_INSTRUMENT;
    }

    const command: Command = {
      type: commandType,
      payload: {
        transactionUID: this.transactionUID,
        instrument: this.getFormData()
      }
    };

    this.uiLayer.execute(command);
  }

  submitPrintRegistrationStampMedia(){
    this.filePrintPreview.open(this.instrument.registration.stampMedia.url,
                               this.instrument.registration.stampMedia.mediaType);
  }

  // private members

  private buildIssuerFilter(keywords: string): IssuersFilter {
    const issuerFilter = {
      instrumentType: this.getFormControl('type').value,
      instrumentKind: this.getFormControl('kind').value,
      onDate: this.getFormControl('issueDate').value,
      keywords
    };

    return issuerFilter;
  }


  private getFormData() {
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

  private loadInstrumentKindList(instrumentType) {
    this.isLoading = true;

    if (!instrumentType || [InstrumentTypeEnum.EscrituraPublica,
                            InstrumentTypeEnum.TituloPropiedad].includes(instrumentType)) {
      this.instrumentKindsList = [];
      this.isLoading = false;
      return;
    }

    this.uiLayer.select<string[]>(RecordableSubjectsStateSelector.INSTRUMENT_KIND_LIST, instrumentType)
                .pipe(take(1))
                .subscribe(x => {
                  this.instrumentKindsList = x.map(item => Object.create({ name: item }));
                  this.isLoading = false;
                });
  }

  private subscribeIssuerList() {
    this.issuerList$ = concat(
      of(isEmpty(this.instrument.issuer) ? [] : [this.instrument.issuer]),
      this.issuerInput$.pipe(
          filter(e => e !== null && e.length >= this.issuerMinTermLength),
          distinctUntilChanged(),
          debounceTime(800),
          tap(() => this.issuerLoading = true),
          switchMap(term =>
            this.uiLayer.select<Issuer[]>(RecordableSubjectsStateSelector.INSTRUMENT_TYPE_ISSUERS_LIST,
                                          this.buildIssuerFilter(term))
          .pipe(
              catchError(() => of([])),
              tap(() => this.issuerLoading = false)
          ))
      )
    );
  }

}
