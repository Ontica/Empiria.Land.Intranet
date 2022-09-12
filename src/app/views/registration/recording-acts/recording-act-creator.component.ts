/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, Empty, EventInfo, Identifiable, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { RecordableSubjectsStateSelector } from '@app/presentation/exported.presentation.types';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { EmptyRegistrationCommandRule, EmptyTractIndex, RecordableSubjectShortModel, RecordableSubjectType,
         RecordingActType, RecordingActTypeGroup, RegistrationCommand, RegistrationCommandConfig,
         RegistrationCommandPayload, RegistrationCommandRule, TractIndex } from '@app/models';

import { FormHandler, sendEvent } from '@app/shared/utils';

import {
  RecordingBookSelectorEventType
} from '@app/views/land-controls/recording-book-selector/recording-book-selector.component';

export enum RecordingActCreatorEventType {
  APPEND_RECORDING_ACT = 'RecordingActCreatorComponent.Event.AppendRecordingAct',
}

enum RecordingActCreatorFormControls {
  recordingActTypeGroup = 'recordingActTypeGroup',
  recordingActType = 'recordingActType',
  registrationCommand = 'registrationCommand',
  recordableSubject = 'recordableSubject',
  recordingBook = 'recordingBook',
  bookEntryUID = 'bookEntryUID',
  bookEntryNo = 'bookEntryNo',
  presentationTime = 'presentationTime',
  authorizationDate = 'authorizationDate',
  partitionType = 'partitionType',
  partitionNo = 'partitionNo',
  amendmentRecordingActUID = 'amendmentRecordingActUID',
}

@Component({
  selector: 'emp-land-recording-act-creator',
  templateUrl: './recording-act-creator.component.html',
})
export class RecordingActCreatorComponent implements OnInit, OnDestroy {

  @Input() instrumentRecordingUID = '';

  @Input() recordableSubjectUID = '';

  @Input() recorderOffice: Identifiable = Empty;

  @Input() recordingActTypeGroupList: RecordingActTypeGroup[] = [];

  @Output() recordingActCreatorEvent = new EventEmitter<EventInfo>();

  helper: SubscriptionHelper;

  formHandler: FormHandler;
  controls = RecordingActCreatorFormControls;

  recordingActTypeList: RecordingActType[] = [];
  registrationCommands: RegistrationCommandConfig[] = [];

  registrationCommandRules: RegistrationCommandRule = EmptyRegistrationCommandRule;

  partitionKindList: string[] = [];
  tractIndexSelected: TractIndex = EmptyTractIndex;

  checkBookEntryInput = false;

  widthFirstColumn = '320px';

  constructor(private uiLayer: PresentationLayer,
              private messageBox: MessageBoxService) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit(): void {
    this.initForm();
    this.loadDataLists();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get isRealEstate() {
    return this.registrationCommandRules.subjectType === RecordableSubjectType.RealEstate;
  }


  get isAssociation() {
    return this.registrationCommandRules.subjectType === RecordableSubjectType.Association;
  }


  get isNoProperty() {
    return this.registrationCommandRules.subjectType === RecordableSubjectType.NoProperty;
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


  onBookEntryCheckChanged() {
    this.formHandler.getControl(this.controls.bookEntryUID).reset();
    this.formHandler.getControl(this.controls.bookEntryNo).reset();
    this.formHandler.getControl(this.controls.presentationTime).reset();
    this.formHandler.getControl(this.controls.authorizationDate).reset();

    this.validateBookEntryFields();
  }


  onRecordingBookSelectorEvent(event){
    switch (event.type as RecordingBookSelectorEventType) {

      case RecordingBookSelectorEventType.RECORDING_BOOK_CHANGED:

        Assertion.assertValue(event.payload.recordingBook, 'event.payload.recordingBook');

        this.formHandler.getControl(this.controls.recordingBook).setValue(event.payload.recordingBook);

        return;

      case RecordingBookSelectorEventType.BOOK_ENTRY_CHANGED:

        Assertion.assertValue(event.payload.bookEntry, 'event.payload.bookEntry');

        const bookEntry = event.payload.bookEntry;

        if (this.checkBookEntryInput) {
          this.formHandler.getControl(this.controls.bookEntryNo).setValue(bookEntry.recordingNo);
          this.formHandler.getControl(this.controls.presentationTime).setValue(bookEntry.presentationTime);
          this.formHandler.getControl(this.controls.authorizationDate).setValue(bookEntry.authorizationDate);
        } else {
          this.formHandler.getControl(this.controls.bookEntryUID).setValue(bookEntry.uid);
        }

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  async submitRecordingAct() {
    if (!this.formHandler.validateReadyForSubmit()) {
      return;
    }

    if (this.confirmContinueWithoutPresentationTimeRequired &&
        !await this.confirmContinueWithoutPresentationTime()) {
      return;
    } else {
      this.emitAppendRecordingAct();
    }
  }


  private initForm() {
    this.formHandler = new FormHandler(
      new FormGroup({
        recordingActTypeGroup: new FormControl('', Validators.required),
        recordingActType: new FormControl('', Validators.required),
        registrationCommand: new FormControl('', Validators.required),
        recordableSubject: new FormControl(''),
        recordingBook: new FormControl(''),
        bookEntryUID: new FormControl(''),
        bookEntryNo: new FormControl(''),
        presentationTime: new FormControl(''),
        authorizationDate: new FormControl(''),
        partitionType: new FormControl(''),
        partitionNo: new FormControl(''),
        amendmentRecordingActUID: new FormControl(''),
      })
    );
  }


  private loadDataLists() {
    this.helper.select<string[]>(RecordableSubjectsStateSelector.REAL_ESTATE_PARTITION_KIND_LIST)
      .subscribe(x => this.partitionKindList = x);
  }


  private getAmendmentRecordingActs() {
    const payload = {
      instrumentRecordingUID: this.instrumentRecordingUID,
      recordableSubjectUID: this.formHandler.getControl(this.controls.recordableSubject).value.uid,
      amendmentRecordingActTypeUID: this.formHandler.getControl(this.controls.recordingActType).value,
    };

    this.helper.select<TractIndex>(RecordableSubjectsStateSelector.AMENDABLE_RECORDING_ACTS, payload)
      .toPromise()
      .then(x => this.tractIndexSelected = x);
  }


  private resetRegistrationCommandRules(registrationCommandRule: RegistrationCommandRule){
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
    if (this.registrationCommandRules.selectBookEntry) {
      this.formHandler.setControlValidators(this.controls.recordingBook, Validators.required);
    } else {
      this.formHandler.clearControlValidators(this.controls.recordingBook);
      this.formHandler.getControl(this.controls.recordingBook).reset();
    }

    this.validateBookEntryFields();
  }


  private validateBookEntryFields() {
    this.formHandler.clearControlValidators(this.controls.bookEntryUID);
    this.formHandler.clearControlValidators(this.controls.bookEntryNo);
    this.formHandler.clearControlValidators(this.controls.authorizationDate);

    if (this.registrationCommandRules.selectBookEntry) {
      if (this.checkBookEntryInput) {
        this.formHandler.setControlValidators(this.controls.bookEntryNo, Validators.required);
        this.formHandler.setControlValidators(this.controls.authorizationDate, Validators.required);
      } else {
        this.formHandler.setControlValidators(this.controls.bookEntryUID, Validators.required);
      }
    } else {
      this.checkBookEntryInput = false;
      this.formHandler.getControl(this.controls.bookEntryUID).reset();
      this.formHandler.getControl(this.controls.bookEntryNo).reset();
      this.formHandler.getControl(this.controls.authorizationDate).reset();
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


  private get confirmContinueWithoutPresentationTimeRequired() {
    return this.checkBookEntryInput && !this.formHandler.getControl(this.controls.presentationTime).value;
  }


  private confirmContinueWithoutPresentationTime(): Promise<boolean> {
    const recordingBook = this.formHandler.getControl(this.controls.recordingBook).value;
    const bookEntryNo = this.formHandler.getControl(this.controls.bookEntryNo).value;
    const title = 'Se está omitiendo la fecha de presentación';
    const message = `¿Está seguro que no hay forma de saber cuál fue la fecha de presentación de la ` +
      `<strong>Inscripción ${bookEntryNo} - Volumen ${recordingBook.name}</strong>?`;
    return this.messageBox.confirm(message, title).toPromise();
  }


  private emitAppendRecordingAct() {
    const registrationCommand: RegistrationCommand = this.getRegistrationCommand();

    const payload = {
      instrumentRecordingUID: this.instrumentRecordingUID,
      recordableSubjectUID: this.recordableSubjectUID,
      registrationCommand,
    };

    sendEvent(this.recordingActCreatorEvent, RecordingActCreatorEventType.APPEND_RECORDING_ACT, payload);
  }


  private getRegistrationCommand(): RegistrationCommand {
    Assertion.assert(this.formHandler.form.valid,
      'Programming error: form must be validated before command execution.');

    const formModel = this.formHandler.form.getRawValue();

    const registrationCommandPayload: RegistrationCommandPayload = this.getRegistrationCommandPayload();

    const registrationCommand: RegistrationCommand = {
      type: formModel.registrationCommand,
      payload: registrationCommandPayload
    };

    return registrationCommand;
  }


  private getRegistrationCommandPayload(): RegistrationCommandPayload {
    Assertion.assert(this.formHandler.form.valid,
      'Programming error: form must be validated before command execution.');

    const formModel = this.formHandler.form.getRawValue();

    let data: RegistrationCommandPayload = {
      recordingActTypeUID: formModel.recordingActType ?? '',
    };

    if (this.registrationCommandRules.selectSubject) {
      data.recordableSubjectUID = !isEmpty(formModel.recordableSubject) ?
        formModel.recordableSubject.uid : '';
    }

    if (this.registrationCommandRules.selectBookEntry) {
      data.recordingBookUID = formModel.recordingBook.uid ?? '';
    }

    if (this.registrationCommandRules.selectBookEntry && this.checkBookEntryInput) {
      data.bookEntryNo = formModel.bookEntryNo ?? '';
      data.authorizationDate = formModel.authorizationDate ?? '';

      if (!!formModel.presentationTime) {
        data.presentationTime = formModel.presentationTime ?? '';
      }
    }

    if (this.registrationCommandRules.newPartition) {
      data.partitionType = formModel.partitionType ?? '';
      data.partitionNo = formModel.partitionNo ?? '';
    }

    if (this.registrationCommandRules.selectTargetAct) {
      data.amendedRecordingActUID = formModel.amendmentRecordingActUID ?? '';
    }

    return data;
  }

}
