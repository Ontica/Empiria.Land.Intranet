/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { concat, of, Subject, Observable } from 'rxjs';

import { catchError, debounceTime, distinctUntilChanged, filter,
         switchMap, take, tap } from 'rxjs/operators';

import { EventInfo, isEmpty, Validate } from '@app/core';

import { PresentationLayer } from '@app/core/presentation';

import { RecordableSubjectsStateSelector } from '@app/core/presentation/presentation-types';

import { Instrument, InstrumentFields, InstrumentTypeEnum, InstrumentTypesList,
         Issuer, IssuersFilter, EmptyInstrument, InstrumentRecordingActions,
         EmptyInstrumentRecordingActions,
         InstrumentType} from '@app/models';


export enum InstrumentEditorEventType {
  CREATE_INSTRUMENT = 'InstrumentEditorEventType.Event.CreateInstrument',
  PRINT_REGISTRATION_STAMP_MEDIA = 'InstrumentEditorEventType.Event.PrintRegistrationStampMedia',
  UPDATE_INSTRUMENT = 'InstrumentEditorEventType.Event.UpdateInstrument',
}


type instrumentFormControls = 'type' | 'sheetsCount' | 'kind' | 'issueDate' | 'issuer' |
  'instrumentNo' | 'binderNo' | 'folio' | 'endFolio' | 'summary' | 'recordingTime' | 'recordingNo' | 'status';


@Component({
  selector: 'emp-land-instrument-editor',
  templateUrl: './instrument-editor.component.html'
})
export class InstrumentEditorComponent implements OnChanges {

  @Input() instrument: Instrument = EmptyInstrument;

  @Input() actions: InstrumentRecordingActions = EmptyInstrumentRecordingActions;

  @Input() addMode = false; // TODO: improve this input name

  @Input() showStatusField = false;

  @Input() title = 'Documento a inscribir';

  @Input() submitButtonText = 'Guardar los Cambios';

  @Input() defaultType: InstrumentType = null;

  @Output() instrumentEditorEvent = new EventEmitter<EventInfo>();

  InstrumentType = InstrumentTypeEnum;

  instrumentTypesList = InstrumentTypesList;

  isLoading = false;
  editionMode = false;
  submitted = false;

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
    summary: new FormControl(''),
    recordingTime: new FormControl(''),
    recordingNo: new FormControl(''),
    status: new FormControl(''),
  });

  instrumentKindsList: any[] = [];

  issuerList$: Observable<Issuer[]>;
  issuerInput$ = new Subject<string>();
  issuerLoading = false;
  issuerMinTermLength = 5;

  statusList = [];

  constructor(private uiLayer: PresentationLayer) { }

  ngOnChanges() {
    this.enableEditor(this.addMode);
    this.loadInstrumentKindList(this.getFormControl('type').value);
  }


  get isReadyForSubmit(){
    return this.form?.valid && this.form?.dirty;
  }


  enableEditor(enable: boolean) {
    this.editionMode = enable;
    this.setFormModel();
    this.setFormValidatorsByType();
    if (this.editionMode) {
      this.form.enable();
    } else {
      this.form.disable();
    }
  }


  getFormControl(name: instrumentFormControls) {
    return this.form.get(name);
  }


  instrumentTypeChange(change) {
    this.loadInstrumentKindList(change.type);
    this.resetForm(change.type === this.instrument.type);
    this.setFormValidatorsByType();
  }


  validateTypeSelected(instrumentTypesArray: InstrumentTypeEnum[]) {
    return instrumentTypesArray.includes(this.getFormControl('type').value);
  }


  submit() {
    if (this.submitted || !this.isReadyForSubmit) {
      this.invalidateForm();
      return;
    }

    this.submitted = true;

    this.sendEvent(this.addMode ? InstrumentEditorEventType.CREATE_INSTRUMENT :
                  InstrumentEditorEventType.UPDATE_INSTRUMENT,
                   this.getFormData());

  }


  submitPrintRegistrationStampMedia() {
    this.sendEvent(InstrumentEditorEventType.PRINT_REGISTRATION_STAMP_MEDIA);
  }


  // private members


  private setFormModel() {
    this.form.reset({
      type: this.instrument.type && this.instrument.type !== 'Empty' ?
        this.instrument.type : this.defaultType,
      sheetsCount: this.instrument.sheetsCount >= 0 ? this.instrument.sheetsCount : '',
      kind: this.instrument.kind,
      issueDate: this.instrument.issueDate,
      issuer: isEmpty(this.instrument.issuer) ? null : this.instrument.issuer.uid,
      instrumentNo: this.instrument.instrumentNo,
      binderNo: this.instrument.binderNo,
      folio: this.instrument.folio,
      endFolio: this.instrument.endFolio,
      summary: this.instrument.summary,

      recordingTime: '',
      recordingNo: '' ,
      status: '',
    });
    this.submitted = false;
    this.subscribeIssuerList();
  }


  private resetForm(resetModel) {
    if (resetModel) {
      this.form.patchValue({
        kind: this.instrument.kind,
        issuer: isEmpty(this.instrument.issuer) ? null : this.instrument.issuer.uid,
        instrumentNo: this.instrument.instrumentNo,
        binderNo: this.instrument.binderNo,
        folio: this.instrument.folio,
        endFolio: this.instrument.endFolio,
        recordingTime: '',
        recordingNo: '' ,
        status: '',
      });
      this.subscribeIssuerList();
    } else {
      this.getFormControl('kind').reset();
      this.getFormControl('issuer').reset();
      this.getFormControl('instrumentNo').reset();
      this.getFormControl('binderNo').reset();
      this.getFormControl('folio').reset();
      this.getFormControl('endFolio').reset();
      this.getFormControl('recordingTime').reset();
      this.getFormControl('recordingNo').reset();
      this.getFormControl('status').reset();
    }
  }


  private setFormValidatorsByType(){
    if (this.showStatusField) {
      this.setControlValidators('status', Validators.required);
    }

    switch (this.getFormControl('type').value) {
      case 'Resumen':
        this.clearControlValidators('sheetsCount');

        this.setControlValidators('kind', Validators.required);
        this.setControlValidators('recordingTime', Validators.required);
        this.setControlValidators('recordingNo', Validators.required);

        return;

      default:
        this.clearControlValidators('kind');
        this.clearControlValidators('recordingTime');
        this.clearControlValidators('recordingNo');

        this.setControlValidators('sheetsCount', [Validators.required, Validate.isPositive]);

        return;
    }
  }


  private setControlValidators(name: instrumentFormControls, validator: any | any[]) {
    this.getFormControl(name).clearValidators();
    this.getFormControl(name).setValidators(validator);
    this.getFormControl(name).updateValueAndValidity();
  }


  private clearControlValidators(name: instrumentFormControls) {
    this.getFormControl(name).clearValidators();
    this.getFormControl(name).updateValueAndValidity();
  }


  private invalidateForm() {
    Object.keys(this.form.controls).forEach(field => {
      const control = this.form.get(field);
      control.markAsTouched({ onlySelf: true });
    });
  }


  private getFormData(): any {
    const formModel = this.form.getRawValue();

    const instrument: InstrumentFields = {
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
      endFolio: formModel.endFolio,
    };

    const data: any = {
      instrumentFields: instrument,
      recordingTime: formModel.recordingTime,
      recordingNo: formModel.recordingNo,
      status: formModel.status
    }

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


  private buildIssuerFilter(keywords: string): IssuersFilter {
    const issuerFilter = {
      instrumentType: this.getFormControl('type').value,
      instrumentKind: this.getFormControl('kind').value,
      onDate: this.getFormControl('issueDate').value,
      keywords
    };

    return issuerFilter;
  }


  private sendEvent(eventType: InstrumentEditorEventType, payload?: any) {
    const event: EventInfo = {
      type: eventType,
      payload
    };

    this.instrumentEditorEvent.emit(event);
  }

}
