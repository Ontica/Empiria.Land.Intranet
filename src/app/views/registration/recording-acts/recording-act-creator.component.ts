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

import { Assertion, EventInfo } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { EmptyInstrumentRecording, EmptyRegistrationCommandRule, InstrumentRecording,
         RecordableSubjectFilter, RecordableSubjectShortModel, RecordingActType, RecordingActTypeGroup,
         RegistrationCommand, RegistrationCommandConfig, RegistrationCommandRule } from '@app/models';

import { RecordableSubjectsStateSelector } from '@app/presentation/exported.presentation.types';

import { FormHandler } from '@app/shared/utils';

export enum RecordingActCreatorEventType {
  APPEND_RECORDING_ACT = 'RecordingActCreatorComponent.Event.AppendRecordingAct',
}

enum RecordingActCreatorFormControls {
  recordingActTypeGroup = 'recordingActTypeGroup',
  recordingActType = 'recordingActType',
  registrationCommand = 'registrationCommand',
  subject = 'subject',
  partitionType = 'partitionType',
  partitionNo = 'partitionNo',
}

@Component({
  selector: 'emp-land-recording-act-creator',
  templateUrl: './recording-act-creator.component.html',
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

  subjectList$: Observable<RecordableSubjectShortModel[]>;
  subjectInput$ = new Subject<string>();
  subjectLoading = false;
  subjectMinTermLength = 5;

  partitionKindList: any[] = [];

  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit(): void {
    this.initForm();
    this.initLoad();
    this.subscribeSubjectList();
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

    this.resetRegistrationCommandRules();
  }


  onRecordingActTypeChange(recordingActType: RecordingActType) {
    this.registrationCommands = recordingActType.registrationCommands ?? [];
    this.formHandler.getControl(this.controls.registrationCommand).reset();
    this.resetRegistrationCommandRules();
  }


  onRegistrationCommandChange(registrationCommand: RegistrationCommandConfig){
    this.setRegistrationCommandRules(registrationCommand.rules);
    this.validateSubjectField();
    this.validatePartitionField();
  }


  submitRecordingAct() {
    if (!this.formHandler.validateReadyForSubmit()) {
      this.formHandler.invalidateForm();
      return;
    }

    const data = this.getFormData();

    const registrationCommand: RegistrationCommand = {
      type: data.registrationCommand,
      payload: {
        recordingActTypeUID: data.recordingActType,
        recordableSubjectUID: data.subject,
        partitionType: data.partitionType,
        partitionNo: data.partitionNo,
      }
    };

    const payload = {
      instrumentRecordingUID: this.instrumentRecording.uid,
      registrationCommand
    };

    this.sendEvent(RecordingActCreatorEventType.APPEND_RECORDING_ACT, payload);
  }


  private initForm() {
    this.formHandler = new FormHandler(
      new FormGroup({
        recordingActTypeGroup: new FormControl('', Validators.required),
        recordingActType: new FormControl('', Validators.required),
        registrationCommand: new FormControl('', Validators.required),
        subject: new FormControl(''),
        partitionType: new FormControl(''),
        partitionNo: new FormControl(''),
      })
    );
  }


  private initLoad() {
    this.helper.select<string[]>(RecordableSubjectsStateSelector.REAL_ESTATE_PARTITION_KIND_LIST)
      .subscribe(x => {
        this.partitionKindList = x.map(item => Object.create({ name: item }));
      });
  }


  private subscribeSubjectList() {
    this.subjectList$ = concat(
      of([]),
      this.subjectInput$.pipe(
          filter(keyword => keyword !== null && keyword.length >= this.subjectMinTermLength),
          distinctUntilChanged(),
          debounceTime(800),
          tap(() => this.subjectLoading = true),
          switchMap(keyword => this.helper.select<RecordableSubjectShortModel[]>(
            RecordableSubjectsStateSelector.RECORDABLE_SUBJECTS_LIST,
            this.buildRecordableSubjectFilter(keyword))
            .pipe(
              catchError(() => of([])),
              tap(() => this.subjectLoading = false)
          ))
      )
    );
  }


  private buildRecordableSubjectFilter(keywords: string): RecordableSubjectFilter {
    const subjectFilter: RecordableSubjectFilter = {
      type: this.registrationCommandRules.subjectType,
      keywords
    };

    return subjectFilter;
  }


  private resetRegistrationCommandRules(){
    this.setRegistrationCommandRules(EmptyRegistrationCommandRule);
    this.validateSubjectField();
    this.validatePartitionField();
  }


  private setRegistrationCommandRules(rules: RegistrationCommandRule){
    this.registrationCommandRules = rules;
  }


  private validateSubjectField(){
    this.formHandler.getControl(this.controls.subject).reset();

    if (this.registrationCommandRules.selectSubject) {
      this.formHandler.setControlValidators(this.controls.subject, Validators.required);
    } else {
      this.formHandler.clearControlValidators(this.controls.subject);
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


  private getFormData(): any {
    Assertion.assert(this.formHandler.form.valid,
      'Programming error: form must be validated before command execution.');

    const formModel = this.formHandler.form.getRawValue();

    const data: any = {
      recordingActTypeGroup: formModel.recordingActTypeGroup ?? '',
      recordingActType: formModel.recordingActType ?? '',
      registrationCommand: formModel.registrationCommand ?? '',
      subject: formModel.subject ?? '',
      partitionType: formModel.partitionType ?? '',
      partitionNo: formModel.partitionNo ?? '',
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
