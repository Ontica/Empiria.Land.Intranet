/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { concat, of, Subject, Observable } from 'rxjs';

import { catchError, debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs/operators';

import { DateString, EventInfo, isEmpty, Validate } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { RecordableSubjectsStateSelector } from '@app/core/presentation/presentation-types';

import { Instrument, InstrumentFields, InstrumentTypesList, Issuer, IssuersFilter, EmptyInstrument,
         InstrumentRecordingActions, EmptyInstrumentRecordingActions, InstrumentType,
         InstrumentTypeItem } from '@app/models';

import { FormHelper, sendEvent } from '@app/shared/utils';

export enum InstrumentEditorEventType {
  CREATE_INSTRUMENT = 'InstrumentEditorEventType.Event.CreateInstrument',
  PRINT_REGISTRATION_STAMP_MEDIA = 'InstrumentEditorEventType.Event.PrintRegistrationStampMedia',
  UPDATE_INSTRUMENT = 'InstrumentEditorEventType.Event.UpdateInstrument',
  EDITION_MODE_CHANGED = 'InstrumentEditorEventType.Event.EditionModeChanged',
  CLOSE_REGISTRATION = 'InstrumentEditorEventType.Event.CloseRegistration',
  OPEN_REGISTRATION = 'InstrumentEditorEventType.Event.OpenRegistration'
}

interface InstrumentFormModel extends FormGroup<{
  type: FormControl<InstrumentType | string>;
  sheetsCount: FormControl<number>;
  kind: FormControl<string>;
  issueDate: FormControl<DateString>;
  issuer: FormControl<string>;
  instrumentNo: FormControl<string>;
  binderNo: FormControl<string>;
  folio: FormControl<string>;
  endFolio: FormControl<string>;
  summary: FormControl<string>;
  status: FormControl<string>;
}> {}

@Component({
  selector: 'emp-land-instrument-editor',
  templateUrl: './instrument-editor.component.html'
})
export class InstrumentEditorComponent implements OnChanges, OnDestroy {

  @Input() instrument: Instrument = EmptyInstrument;

  @Input() actions: InstrumentRecordingActions = EmptyInstrumentRecordingActions;

  @Input() addMode = false;

  @Input() showStatusField = false;

  @Input() title = 'Instrumento jurídico a inscribir';

  @Input() submitButtonText = 'Guardar los Cambios';

  @Input() defaultType: InstrumentType = null;

  @Output() instrumentEditorEvent = new EventEmitter<EventInfo>();

  InstrumentTypes = InstrumentType;

  instrumentTypesList: InstrumentTypeItem[] = InstrumentTypesList;

  helper: SubscriptionHelper;

  form: InstrumentFormModel;

  formHelper = FormHelper;

  editionMode = false;

  isLoading = false;

  instrumentKindsList: any[] = [];

  issuerList$: Observable<Issuer[]>;

  issuerInput$ = new Subject<string>();

  issuerLoading = false;

  issuerMinTermLength = 5;

  statusList = [];

  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
    this.initForm();
  }


  ngOnChanges() {
    this.enableEditor(this.addMode);
    this.loadInstrumentKindList(this.typeSelected);
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get typeSelected(): InstrumentType {
    return this.form.value.type as InstrumentType;
  }


  enableEditor(enable: boolean) {
    this.editionMode = enable;
    this.setFormModel();
    this.setFormValidatorsByType();
    this.formHelper.setDisableForm(this.form, !this.editionMode);
    sendEvent(this.instrumentEditorEvent, InstrumentEditorEventType.EDITION_MODE_CHANGED, this.editionMode);
  }


  validateTypeSelected(instrumentTypesArray: InstrumentType[]) {
    return instrumentTypesArray.includes(this.typeSelected);
  }


  onInstrumentTypeChanges(change: InstrumentTypeItem) {
    this.loadInstrumentKindList(change.type);
    this.resetForm(change.type === this.instrument.type);
    this.setFormValidatorsByType();
  }


  onCloseRegistrationClicked() {
    sendEvent(this.instrumentEditorEvent, InstrumentEditorEventType.CLOSE_REGISTRATION);
  }

  onOpenRegistrationClicked() {
    sendEvent(this.instrumentEditorEvent, InstrumentEditorEventType.OPEN_REGISTRATION);
  }


  onSubmitClicked() {
    if (this.formHelper.isFormReadyAndInvalidate(this.form)) {
      const eventType = this.addMode ?
        InstrumentEditorEventType.CREATE_INSTRUMENT : InstrumentEditorEventType.UPDATE_INSTRUMENT;

      sendEvent(this.instrumentEditorEvent, eventType, {instrumentFields: this.getFormData()});
    }
  }


  onPrintRegistrationStampMediaClicked() {
    sendEvent(this.instrumentEditorEvent, InstrumentEditorEventType.PRINT_REGISTRATION_STAMP_MEDIA);
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      type: ['', Validators.required],
      sheetsCount: [null],
      kind: [''],
      issueDate: [null],
      issuer: [''],
      instrumentNo: [''],
      binderNo: [''],
      folio: [''],
      endFolio: [''],
      summary: [''],
      status: [''],
    });
  }


  private setFormModel() {
    this.form.reset({
      type: this.instrument.type && this.instrument.type !== 'Empty' as InstrumentType ?
        this.instrument.type : this.defaultType,
      sheetsCount: this.instrument.sheetsCount >= 0 ? this.instrument.sheetsCount : null,
      kind: this.instrument.kind,
      issueDate: this.instrument.issueDate,
      issuer: isEmpty(this.instrument.issuer) ? null : this.instrument.issuer.uid,
      instrumentNo: this.instrument.instrumentNo,
      binderNo: this.instrument.binderNo,
      folio: this.instrument.folio,
      endFolio: this.instrument.endFolio,
      summary: this.instrument.summary,
      status: '',
    });

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
        status: '',
      });
      this.subscribeIssuerList();
    } else {
      this.form.controls.kind.reset();
      this.form.controls.issuer.reset();
      this.form.controls.instrumentNo.reset();
      this.form.controls.binderNo.reset();
      this.form.controls.folio.reset();
      this.form.controls.endFolio.reset();
      this.form.controls.status.reset();
    }
  }


  private setFormValidatorsByType(){
    if (this.showStatusField) {
      // this.formHelper.setControlValidators(this.form.controls.status, Validators.required);
    }

    switch (this.typeSelected) {
      case 'Resumen':
        this.formHelper.clearControlValidators(this.form.controls.sheetsCount);
        this.formHelper.setControlValidators(this.form.controls.kind, Validators.required);
        return;

      default:
        this.formHelper.clearControlValidators(this.form.controls.kind);
        this.formHelper.setControlValidators(this.form.controls.sheetsCount,
          [Validators.required, Validate.isPositive]);
        return;
    }
  }


  private getFormData(): InstrumentFields {
    const formModel = this.form.getRawValue();

    const data: InstrumentFields = {
      uid: this.instrument.uid,
      type: formModel.type as InstrumentType,
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

    return data;
  }


  private loadInstrumentKindList(instrumentType: InstrumentType) {
    this.isLoading = true;

    if (!instrumentType || [InstrumentType.EscrituraPublica,
                            InstrumentType.TituloPropiedad].includes(instrumentType)) {
      this.instrumentKindsList = [];
      this.isLoading = false;
      return;
    }

    this.helper.select<string[]>(RecordableSubjectsStateSelector.INSTRUMENT_KIND_LIST, instrumentType)
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
          this.helper.select<Issuer[]>(RecordableSubjectsStateSelector.INSTRUMENT_TYPE_ISSUERS_LIST,
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
      instrumentType: this.form.value.type,
      instrumentKind: this.form.value.kind,
      onDate: this.form.value.issueDate,
      keywords
    };

    return issuerFilter;
  }

}
