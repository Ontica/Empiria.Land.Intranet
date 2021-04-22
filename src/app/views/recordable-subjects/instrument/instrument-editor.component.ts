/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { concat, of, Subject, Observable } from 'rxjs';

import { catchError, debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs/operators';

import { EventInfo, isEmpty, Validate } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { RecordableSubjectsStateSelector } from '@app/core/presentation/presentation-types';

import { Instrument, InstrumentFields, InstrumentTypeEnum, InstrumentTypesList, Issuer, IssuersFilter,
         EmptyInstrument, InstrumentRecordingActions, EmptyInstrumentRecordingActions,
         InstrumentType} from '@app/models';

import { FormHandler } from '@app/shared/utils';

export enum InstrumentEditorEventType {
  CREATE_INSTRUMENT = 'InstrumentEditorEventType.Event.CreateInstrument',
  PRINT_REGISTRATION_STAMP_MEDIA = 'InstrumentEditorEventType.Event.PrintRegistrationStampMedia',
  UPDATE_INSTRUMENT = 'InstrumentEditorEventType.Event.UpdateInstrument',
  EDITION_MODE_CHANGED = 'InstrumentEditorEventType.Event.EditionModeChanged',
}

enum InstrumentFormControls {
  type = 'type',
  sheetsCount = 'sheetsCount',
  kind = 'kind',
  issueDate = 'issueDate',
  issuer = 'issuer',
  instrumentNo = 'instrumentNo',
  binderNo = 'binderNo',
  folio = 'folio',
  endFolio = 'endFolio',
  summary = 'summary',
  status = 'status',
}

@Component({
  selector: 'emp-land-instrument-editor',
  templateUrl: './instrument-editor.component.html'
})
export class InstrumentEditorComponent implements OnChanges, OnDestroy {

  @Input() instrument: Instrument = EmptyInstrument;

  @Input() actions: InstrumentRecordingActions = EmptyInstrumentRecordingActions;

  @Input() addMode = false;

  @Input() showStatusField = false;

  @Input() title = 'Documento a inscribir';

  @Input() submitButtonText = 'Guardar los Cambios';

  @Input() defaultType: InstrumentType = null;

  @Output() instrumentEditorEvent = new EventEmitter<EventInfo>();

  InstrumentType = InstrumentTypeEnum;

  instrumentTypesList = InstrumentTypesList;

  helper: SubscriptionHelper;

  formHandler: FormHandler;
  controls = InstrumentFormControls;
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


  get typeSelected() {
    return this.formHandler.getControl(this.controls.type).value;
  }


  enableEditor(enable: boolean) {
    this.editionMode = enable;
    this.setFormModel();
    this.setFormValidatorsByType();
    this.formHandler.disableForm(!this.editionMode);
    this.sendEvent(InstrumentEditorEventType.EDITION_MODE_CHANGED, this.editionMode);
  }


  validateTypeSelected(instrumentTypesArray: InstrumentTypeEnum[]) {
    return instrumentTypesArray.includes(this.typeSelected);
  }


  onInstrumentTypeChange(change) {
    this.loadInstrumentKindList(change.type);
    this.resetForm(change.type === this.instrument.type);
    this.setFormValidatorsByType();
  }


  submit() {
    if (!this.formHandler.form.valid) {
      this.formHandler.invalidateForm();
      return;
    }

    this.sendEvent(this.addMode ? InstrumentEditorEventType.CREATE_INSTRUMENT :
                   InstrumentEditorEventType.UPDATE_INSTRUMENT,
                   { instrumentFields: this.getFormData() });
  }


  submitPrintRegistrationStampMedia() {
    this.sendEvent(InstrumentEditorEventType.PRINT_REGISTRATION_STAMP_MEDIA);
  }


  private initForm() {
    this.formHandler = new FormHandler(
      new FormGroup({
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
        status: new FormControl(''),
      }));
  }


  private setFormModel() {
    this.formHandler.form.reset({
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
      status: '',
    });

    this.subscribeIssuerList();
  }


  private resetForm(resetModel) {
    if (resetModel) {
      this.formHandler.form.patchValue({
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
      this.formHandler.getControl(this.controls.kind).reset();
      this.formHandler.getControl(this.controls.issuer).reset();
      this.formHandler.getControl(this.controls.instrumentNo).reset();
      this.formHandler.getControl(this.controls.binderNo).reset();
      this.formHandler.getControl(this.controls.folio).reset();
      this.formHandler.getControl(this.controls.endFolio).reset();
      this.formHandler.getControl(this.controls.status).reset();
    }
  }


  private setFormValidatorsByType(){
    if (this.showStatusField) {
      // this.formHandler.setControlValidators('status', Validators.required);
    }

    switch (this.typeSelected) {
      case 'Resumen':
        this.formHandler.clearControlValidators('sheetsCount');
        this.formHandler.setControlValidators('kind', Validators.required);
        return;

      default:
        this.formHandler.clearControlValidators('kind');
        this.formHandler.setControlValidators('sheetsCount', [Validators.required, Validate.isPositive]);
        return;
    }
  }


  private getFormData(): InstrumentFields {
    const formModel = this.formHandler.form.getRawValue();

    const data: InstrumentFields = {
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
      instrumentType: this.formHandler.getControl(this.controls.type).value,
      instrumentKind: this.formHandler.getControl(this.controls.kind).value,
      onDate: this.formHandler.getControl(this.controls.issueDate).value.value,
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
