/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { concat, Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs/operators';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, Command, Identifiable } from '@app/core';
import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { EmptyInstrumentRecording, InstrumentRecording,
         RecordingActType, RecordingActTypeGroup, RegistrationCommand } from '@app/models';

import { RegistrationCommandType,
         RecordableSubjectsStateSelector} from '@app/presentation/exported.presentation.types';

import { FormHandler } from '@app/shared/utils';

enum RecordingActCreatorFormControls {
  recordingActTypeGroup = 'recordingActTypeGroup',
  recordingActType = 'recordingActType',
  subjectCommand = 'subjectCommand',
  realEstate = 'realEstate',
  partitionType = 'partitionType',
  partitionNo = 'partitionNo',
}

@Component({
  selector: 'emp-land-recording-act-creator',
  templateUrl: './recording-act-creator.component.html',
})
export class RecordingActCreatorComponent implements OnInit, OnDestroy {

  @Input() instrumentRecording: InstrumentRecording = EmptyInstrumentRecording;

  helper: SubscriptionHelper;

  formHandler: FormHandler;
  controls = RecordingActCreatorFormControls;
  submitted = false;

  recordingActTypeGroupList: RecordingActTypeGroup[] = [];
  recordingActTypeList: RecordingActType[] = [];
  subjectCommandList: Identifiable[] = [];

  showRealEstateField = false;
  showPartitionField = false;

  realEstateList$: Observable<any[]>;
  realEstateInput$ = new Subject<string>();
  realEstateLoading = false;
  realEstateMinTermLength = 5;

  realEstatePartitionKindList: any[] = [];

  showSeeker = false;

  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit(): void {
    this.initForm();
    this.initLoad();
    this.subscribeRealEstateList();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  onRecordingActTypeGroupChange(recordingActTypeGroup: RecordingActTypeGroup) {
    this.recordingActTypeList = recordingActTypeGroup.recordingActTypes ?? [];
    this.subjectCommandList = [];

    this.formHandler.getControl(this.controls.recordingActType).reset();
    this.formHandler.getControl(this.controls.subjectCommand).reset();
  }


  onRecordingActTypeChange(recordingActType: RecordingActType) {
    this.subjectCommandList = recordingActType.subjectCommands ?? [];
    this.formHandler.getControl(this.controls.subjectCommand).reset();
  }


  onSubjectCommandChange(){
    this.validateRealEstateField();
    this.validatePartitionField();
    this.showSeeker = false;
  }


  submitRecordingAct() {
    if (this.submitted || !this.formHandler.validateReadyForSubmit()) {
      this.formHandler.invalidateForm();
      return;
    }

    const data = this.getFormData();

    const registrationCommand: RegistrationCommand = {
      type: data.subjectCommand,
      payload: {
        recordingActTypeUID: data.recordingActType,
        recordableSubjectUID: data.realEstate,
        partitionType: data.partitionType,
        partitionNo: data.partitionNo,
      }
    };

    const payload = {
      instrumentRecordingUID: this.instrumentRecording.uid,
      registrationCommand
    };

    this.executeCommand(RegistrationCommandType.CREATE_RECORDING_ACT, payload);
  }


  private initForm() {
    this.formHandler = new FormHandler(
      new FormGroup({
        recordingActTypeGroup: new FormControl('', Validators.required),
        recordingActType: new FormControl('', Validators.required),
        subjectCommand: new FormControl('', Validators.required),
        realEstate: new FormControl(''),
        partitionType: new FormControl(''),
        partitionNo: new FormControl(''),
      })
    );
  }


  private initLoad() {
    this.helper.select<RecordingActTypeGroup[]>(
      RecordableSubjectsStateSelector.RECORDING_ACT_TYPES_LIST_FOR_INSTRUMENT,
      { instrumentUID: this.instrumentRecording.instrument.uid })
      .subscribe(x => {
        this.recordingActTypeGroupList = x;
      });

    this.helper.select<string[]>(RecordableSubjectsStateSelector.REAL_ESTATE_PARTITION_KIND_LIST)
      .subscribe(x => {
        this.realEstatePartitionKindList = x.map(item => Object.create({ name: item }));
      });
  }


  private subscribeRealEstateList() {
    this.realEstateList$ = concat(
      of([]),
      this.realEstateInput$.pipe(
          filter(keyword => keyword !== null && keyword.length >= this.realEstateMinTermLength),
          distinctUntilChanged(),
          debounceTime(800),
          tap(() => this.realEstateLoading = true),
          switchMap(keyword => of([])
                          //  this.helper.select<any[]>(RecordableSubjectsStateSelector.RECORDING_BOOKS_LIST,
                          //  this.buildRealEstateFilter(keyword))
            .pipe(
              catchError(() => of([])),
              tap(() => this.realEstateLoading = false)
          ))
      )
    );
  }


  private buildRealEstateFilter(keywords: string): any {
    const realEstateFilter = {
      recordingActType: '',
      subjectCommand: '',
      keywords
    };

    return realEstateFilter;
  }


  private validateRealEstateField(){
    this.showRealEstateField = ['SelectRealEstate', 'SelectRealEstatePartition']
                               .includes(this.formHandler.getControl(this.controls.subjectCommand).value);

    if (this.showRealEstateField) {
      this.formHandler.setControlValidators(this.controls.realEstate, Validators.required);
    } else {
      this.formHandler.clearControlValidators(this.controls.realEstate);
    }
  }


  private validatePartitionField(){
    this.showPartitionField = ['SelectRealEstatePartition']
                               .includes(this.formHandler.getControl(this.controls.subjectCommand).value);

    if (this.showPartitionField) {
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
      subjectCommand: formModel.subjectCommand ?? '',
      realEstate: formModel.realEstate ?? '',
      partitionType: formModel.partitionType ?? '',
      partitionNo: formModel.partitionNo ?? '',
    };

    return data;
  }


  private executeCommand<T>(commandType: any, payload?: any): Promise<T> {
    this.submitted = true;

    const command: Command = {
      type: commandType,
      payload
    };

    return this.uiLayer.execute<T>(command)
      .finally(() => this.submitted = false);
  }

}
