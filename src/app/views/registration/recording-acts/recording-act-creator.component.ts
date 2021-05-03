/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { concat, Observable, of, Subject } from 'rxjs';

import { catchError, debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs/operators';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { EmptyInstrumentRecording, EmptyRegistrationCommandRule, EmptyTractIndex, InstrumentRecording,
         RecordableSubjectFilter, RecordableSubjectShortModel, RecordingActType, RecordingActTypeGroup,
         RegistrationCommand, RegistrationCommandConfig, RegistrationCommandPayload,
         RegistrationCommandRule, TractIndex} from '@app/models';

import { RecordableSubjectsStateSelector } from '@app/presentation/exported.presentation.types';

import { FormHandler } from '@app/shared/utils';

import { RecordingBookSelectorEventType } from '../recording-book/recording-book-selector.component';

export enum RecordingActCreatorEventType {
  APPEND_RECORDING_ACT = 'RecordingActCreatorComponent.Event.AppendRecordingAct',
}

enum RecordingActCreatorFormControls {
  recordingActTypeGroup = 'recordingActTypeGroup',
  recordingActType = 'recordingActType',
  registrationCommand = 'registrationCommand',
  recordableSubject = 'recordableSubject',
  recordingBookUID = 'recordingBookUID',
  bookEntryUID = 'bookEntryUID',
  bookEntryNo = 'bookEntryNo',
  partitionType = 'partitionType',
  partitionNo = 'partitionNo',
  amendmentRecordingActUID = 'amendmentRecordingActUID',
}

@Component({
  selector: 'emp-land-recording-act-creator',
  templateUrl: './recording-act-creator.component.html',
  styles: [`.resizable-field-width {
    width: calc(100% - 490px); /* widthFirstColumn + 150px */
  }`]
})
export class RecordingActCreatorComponent implements OnInit, OnDestroy {

  @Input() instrumentRecording: InstrumentRecording = EmptyInstrumentRecording;

  @Input() recordingActTypeGroupList: RecordingActTypeGroup[] = [];

  @Output() recordingActCreatorEvent = new EventEmitter<EventInfo>();

  helper: SubscriptionHelper;

  formHandler: FormHandler;
  controls = RecordingActCreatorFormControls;

  recordingActTypeList: RecordingActType[] = [];
  registrationCommands: RegistrationCommandConfig[] = [];

  registrationCommandRules: RegistrationCommandRule = EmptyRegistrationCommandRule;

  recordableSubjectList$: Observable<RecordableSubjectShortModel[]>;
  recordableSubjectInput$ = new Subject<string>();
  recordableSubjectLoading = false;
  recordableSubjectMinTermLength = 5;

  partitionKindList: any[] = [];
  tractIndexSelected: TractIndex = EmptyTractIndex;

  checkBookEntryInput = false;

  widthFirstColumn = '340px';

  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit(): void {
    this.initForm();
    this.initLoad();
    this.subscribeRecordableSubjectList();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get isRealEstate() {
    return this.registrationCommandRules.subjectType === 'RealEstate';
  }


  get isAssociation() {
    return this.registrationCommandRules.subjectType === 'Association';
  }


  get isNoProperty() {
    return this.registrationCommandRules.subjectType === 'NoProperty';
  }


  onRecordingActTypeGroupChange(recordingActTypeGroup: RecordingActTypeGroup) {
    this.recordingActTypeList = recordingActTypeGroup.recordingActTypes ?? [];
    this.registrationCommands = [];

    this.formHandler.getControl(this.controls.recordingActType).reset();
    this.formHandler.getControl(this.controls.registrationCommand).reset();

    this.resetRegistrationCommandRules(EmptyRegistrationCommandRule);
  }


  onRecordingActTypeChange(recordingActType: RecordingActType) {
    this.registrationCommands = recordingActType.registrationCommands ?? [];
    this.formHandler.getControl(this.controls.registrationCommand).reset();
    this.resetRegistrationCommandRules(EmptyRegistrationCommandRule);
  }


  onRegistrationCommandChange(registrationCommand: RegistrationCommandConfig){
    this.resetRegistrationCommandRules(registrationCommand.rules);
    this.formHandler.invalidateForm();
  }


  onRecordableSubjectChange(recordableSubject: RecordableSubjectShortModel) {
    this.validateAmendmentRecordingActFields();

    if (isEmpty(recordableSubject)) {
      this.setTractIndexSelected(EmptyTractIndex);
      return;
    }

    this.getAmendmentRecordingActs();
  }


  onBookEntryCheckChanged(check: boolean) {
    this.validateBookEntryFields();
  }


  onRecordingBookSelectorEvent(event){
    switch (event.type as RecordingBookSelectorEventType) {

      case RecordingBookSelectorEventType.RECORDING_BOOK_CHANGED:

        Assertion.assertValue(event.payload.recordingBook, 'event.payload.recordingBook');

        this.formHandler.getControl(this.controls.recordingBookUID).setValue(event.payload.recordingBook.uid);

        return;

      case RecordingBookSelectorEventType.BOOK_ENTRY_CHANGED:

        Assertion.assertValue(event.payload.bookEntry, 'event.payload.bookEntry');

        if (this.checkBookEntryInput) {
          this.formHandler.getControl(this.controls.bookEntryNo)
            .setValue(event.payload.bookEntry.recordingNo);
        } else {
          this.formHandler.getControl(this.controls.bookEntryUID)
            .setValue(event.payload.bookEntry.uid);
        }

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  submitRecordingAct() {
    if (!this.formHandler.validateReadyForSubmit()) {
      return;
    }

    const data = this.getFormData();

    const registrationCommandPayload: RegistrationCommandPayload = {
      recordingActTypeUID: data.recordingActType,
      recordableSubjectUID: data.recordableSubject,
      recordingBookUID: data.recordingBookUID,
      bookEntryUID: data.bookEntryUID,
      bookEntryNo: data.bookEntryNo,
      partitionType: data.partitionType,
      partitionNo: data.partitionNo,
      amendedRecordingActUID: data.amendmentRecordingActUID
    };

    const registrationCommand: RegistrationCommand = {
      type: data.registrationCommand,
      payload: registrationCommandPayload
    };

    this.sendEvent(RecordingActCreatorEventType.APPEND_RECORDING_ACT,
      { instrumentRecordingUID: this.instrumentRecording.uid, registrationCommand });
  }


  private initForm() {
    this.formHandler = new FormHandler(
      new FormGroup({
        recordingActTypeGroup: new FormControl('', Validators.required),
        recordingActType: new FormControl('', Validators.required),
        registrationCommand: new FormControl('', Validators.required),
        recordableSubject: new FormControl(''),
        recordingBookUID: new FormControl(''),
        bookEntryUID: new FormControl(''),
        bookEntryNo: new FormControl(''),
        partitionType: new FormControl(''),
        partitionNo: new FormControl(''),
        amendmentRecordingActUID: new FormControl(''),
      })
    );
  }


  private initLoad() {
    this.helper.select<string[]>(RecordableSubjectsStateSelector.REAL_ESTATE_PARTITION_KIND_LIST)
      .subscribe(x => {
        this.partitionKindList = x.map(item => Object.create({ name: item }));
      });
  }


  private subscribeRecordableSubjectList() {
    this.recordableSubjectList$ = concat(
      of([]),
      this.recordableSubjectInput$.pipe(
          filter(keyword => keyword !== null && keyword.length >= this.recordableSubjectMinTermLength),
          distinctUntilChanged(),
          debounceTime(800),
          tap(() => this.recordableSubjectLoading = true),
          switchMap(keyword => this.helper.select<RecordableSubjectShortModel[]>(
            RecordableSubjectsStateSelector.RECORDABLE_SUBJECTS_LIST,
            this.buildRecordableSubjectFilter(keyword))
            .pipe(
              catchError(() => of([])),
              tap(() => this.recordableSubjectLoading = false)
          ))
      )
    );
  }


  private buildRecordableSubjectFilter(keywords: string): RecordableSubjectFilter {
    const recordableSubjectFilter: RecordableSubjectFilter = {
      type: this.registrationCommandRules.subjectType,
      keywords
    };

    return recordableSubjectFilter;
  }


  private getAmendmentRecordingActs() {
    const payload = {
      instrumentRecordingUID: this.instrumentRecording.uid,
      recordableSubject: this.formHandler.getControl(this.controls.recordableSubject).value,
      amendmentRecordingActTypeUID: this.formHandler.getControl(this.controls.recordingActType).value,
    };

    this.helper.select<TractIndex>(RecordableSubjectsStateSelector.AMENDABLE_RECORDING_ACTS, payload)
      .subscribe(x => {
        this.tractIndexSelected = x;
      });
  }


  private resetRegistrationCommandRules(registrationCommandRule: RegistrationCommandRule){
    this.checkBookEntryInput = false;
    this.setRegistrationCommandRules(registrationCommandRule);
    this.setTractIndexSelected(EmptyTractIndex);
    this.validateRecordableSubjectField();
    this.validatePartitionField();
    this.validateRecordingBookFields();
    this.validateAmendmentRecordingActFields();
  }


  private setRegistrationCommandRules(rules: RegistrationCommandRule){
    this.registrationCommandRules = rules;
  }


  private setTractIndexSelected(tractIndex: TractIndex) {
    this.tractIndexSelected = tractIndex;
  }


  private validateRecordableSubjectField(){
    this.formHandler.getControl(this.controls.recordableSubject).reset();

    if (this.registrationCommandRules.selectSubject) {
      this.formHandler.setControlValidators(this.controls.recordableSubject, Validators.required);
    } else {
      this.formHandler.clearControlValidators(this.controls.recordableSubject);
    }
  }


  private validatePartitionField(){
    this.formHandler.getControl(this.controls.partitionNo).reset();
    this.formHandler.getControl(this.controls.partitionType).reset();

    if (this.registrationCommandRules.newPartition) {
      this.formHandler.setControlValidators(this.controls.partitionType, Validators.required);
      this.formHandler.setControlValidators(this.controls.partitionNo, Validators.required);
    } else {
      this.formHandler.clearControlValidators(this.controls.partitionType);
      this.formHandler.clearControlValidators(this.controls.partitionNo);
    }
  }


  private validateRecordingBookFields(){
    this.formHandler.getControl(this.controls.recordingBookUID).reset();

    if (this.registrationCommandRules.selectBookEntry) {
      this.formHandler.setControlValidators(this.controls.recordingBookUID, Validators.required);
    } else {
      this.formHandler.clearControlValidators(this.controls.recordingBookUID);
    }

    this.validateBookEntryFields();
  }


  private validateBookEntryFields() {
    this.formHandler.getControl(this.controls.bookEntryUID).reset();
    this.formHandler.getControl(this.controls.bookEntryNo).reset();

    this.formHandler.clearControlValidators(this.controls.bookEntryUID);
    this.formHandler.clearControlValidators(this.controls.bookEntryNo);

    if (this.registrationCommandRules.selectBookEntry) {
      if (this.checkBookEntryInput) {
        this.formHandler.setControlValidators(this.controls.bookEntryNo, Validators.required);
      } else {
        this.formHandler.setControlValidators(this.controls.bookEntryUID, Validators.required);
      }
    }
  }


  private validateAmendmentRecordingActFields(){
    this.formHandler.getControl(this.controls.amendmentRecordingActUID).reset();

    if (this.registrationCommandRules.selectTargetAct) {
      this.formHandler.setControlValidators(this.controls.amendmentRecordingActUID, Validators.required);
    } else {
      this.formHandler.clearControlValidators(this.controls.amendmentRecordingActUID);
    }
  }


  private getFormData(): any {
    Assertion.assert(this.formHandler.form.valid,
      'Programming error: form must be validated before command execution.');

    const formModel = this.formHandler.form.getRawValue();

    const data: any = {
      recordingActTypeGroup: formModel.recordingActTypeGroup ?? '',
      recordingActType: formModel.recordingActType ?? '',
      registrationCommand: formModel.registrationCommand ?? '',
      recordableSubject: formModel.recordableSubject ?? '',
      recordingBookUID: formModel.recordingBookUID ?? '',
      bookEntryUID: formModel.bookEntryUID ?? '',
      bookEntryNo: formModel.bookEntryNo ?? '',
      partitionType: formModel.partitionType ?? '',
      partitionNo: formModel.partitionNo ?? '',
      amendmentRecordingActUID: formModel.amendmentRecordingActUID ?? '',
    };

    return data;
  }


  private sendEvent(eventType: RecordingActCreatorEventType, payload?: any) {
    const event: EventInfo = {
      type: eventType,
      payload
    };

    this.recordingActCreatorEvent.emit(event);
  }

}
