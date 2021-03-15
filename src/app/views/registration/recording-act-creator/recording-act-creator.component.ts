/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Assertion, Command, Identifiable } from '@app/core';
import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';
import { RecordingActType, RecordingActTypeGroup } from '@app/models';
import { RecordableSubjectsStateSelector } from '@app/presentation/exported.presentation.types';
import { FormHandler } from '@app/shared/utils';
import { concat, Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs/operators';


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

  @Input() instrumentUID: string;

  helper: SubscriptionHelper;

  formHandler: FormHandler;
  controls = RecordingActCreatorFormControls;
  submitted = false;

  recordingActTypeGroupList: RecordingActTypeGroup[] = [];
  recordingActTypeList: RecordingActType[] = [];
  subjectCommandList: Identifiable[] = [];

  showRealEstateField = false;
  showPartitionField = false;
  showSeeker = false;

  realEstateList$: Observable<any[]>;
  realEstateInput$ = new Subject<string>();
  realEstateLoading = false;
  realEstateMinTermLength = 5;

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

    this.formHandler.getControl('recordingActType').reset();
    this.formHandler.getControl('subjectCommand').reset();
  }


  onRecordingActTypeChange(recordingActType: RecordingActType) {
    this.subjectCommandList = recordingActType.subjectCommands ?? [];
    this.formHandler.getControl('subjectCommand').reset();
  }


  subjectCommandChange(){
    this.showRealEstateField = ['SelectRealEstate', 'SelectRealEstatePartition']
                               .includes(this.formHandler.getControl('subjectCommand').value);

    this.showPartitionField = ['SelectRealEstatePartition']
                               .includes(this.formHandler.getControl('subjectCommand').value);

    this.showSeeker = false;

    if (this.showRealEstateField) {
      this.formHandler.setControlValidators('realEstate', Validators.required);
    } else {
      this.formHandler.clearControlValidators('realEstate');
    }
  }


  submitRecordingAct() {

    if (this.submitted || !this.formHandler.validateReadyForSubmit()) {
      this.formHandler.invalidateForm();
      return;
    }

    const payload = {
      instrumentUID: this.instrumentUID,
      recordingAct: this.getFormData()
    };

    console.log(payload);

    // this.executeCommand<Instrument>(InstrumentsCommandType.CREATE_PHYSICAL_RECORDING, payload);
  }


  private initLoad() {
    this.helper.select<RecordingActTypeGroup[]>(
      RecordableSubjectsStateSelector.RECORDING_ACT_TYPES_LIST_FOR_INSTRUMENT,
      { instrumentUID: this.instrumentUID })
      .subscribe(x => {
        this.recordingActTypeGroupList = x;
      });
  }


  private subscribeRealEstateList() {
    // this.realEstateList$ = concat(
    //   of([]),
    //   this.realEstateInput$.pipe(
    //       filter(e => e !== null && e.length >= this.realEstateMinTermLength),
    //       distinctUntilChanged(),
    //       debounceTime(800),
    //       tap(() => this.realEstateLoading = true),
    //       switchMap(term =>
    //         this.uiLayer.select<any[]>(InstrumentsStateSelector.ISSUER_LIST,
    //                                       this.buildRealEstateFilter(term))
    //           .pipe(
    //               catchError(() => of([])),
    //               tap(() => this.realEstateLoading = false)
    //       ))
    //   )
    // );
  }


  // private buildRealEstateFilter(keywords: string): any {
  //   const realEstateFilter = {
  //     instrumentType: 'DocumentoTerceros',
  //     instrumentKind: '',
  //     onDate: '',
  //     keywords
  //   };

  //   return realEstateFilter;
  // }


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
