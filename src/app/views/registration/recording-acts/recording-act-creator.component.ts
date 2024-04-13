/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, DateString, Empty, EventInfo, Identifiable, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { RecordableSubjectsStateSelector } from '@app/presentation/exported.presentation.types';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { BookEntryShortModel, EmptyRegistrationCommandRule, EmptyTractIndex, EmptyTractIndexEntry,
         RecordableSubject, RecordableSubjectType, RecordingActSearchQuery, RecordingActType,
         RecordingActTypeGroup, RegistrationCommand, RegistrationCommandConfig, RegistrationCommandPayload,
         RegistrationCommandRule, TractIndex, TractIndexEntry } from '@app/models';

import { FormHelper, sendEvent } from '@app/shared/utils';

import {
  RecordingBookSelectorEventType
} from '@app/views/land-controls/recording-book-selector/recording-book-selector.component';

export enum RecordingActCreatorEventType {
  APPEND_RECORDING_ACT = 'RecordingActCreatorComponent.Event.AppendRecordingAct',
}

interface RecordingActFormModel extends FormGroup<{
  recordingActTypeGroup: FormControl<string>;
  recordingActType: FormControl<string>;
  registrationCommand: FormControl<string>;
  recordableSubject: FormControl<RecordableSubject>;
  recordingBook: FormControl<Identifiable>;
  bookEntryUID: FormControl<string>;
  bookEntryNo: FormControl<string>;
  presentationTime: FormControl<DateString>;
  authorizationDate: FormControl<DateString>;
  partitionType: FormControl<string>;
  partitionNo: FormControl<string>;
  amendmentRecordingActUID: FormControl<string>;
}> { }

@Component({
  selector: 'emp-land-recording-act-creator',
  templateUrl: './recording-act-creator.component.html',
  styles: [`
    .searcher-item-container {
      font-size: 8pt;
      padding: 8px 4px 0 4px;
    }`
  ],
})
export class RecordingActCreatorComponent implements OnInit, OnDestroy {

  @Input() instrumentRecordingUID = '';

  @Input() recordableSubjectUID = '';

  @Input() recorderOffice: Identifiable = Empty;

  @Input() recordingActTypeGroupList: RecordingActTypeGroup[] = [];

  @Output() recordingActCreatorEvent = new EventEmitter<EventInfo>();

  helper: SubscriptionHelper;

  form: RecordingActFormModel;

  formHelper = FormHelper;

  recordingActTypeList: RecordingActType[] = [];

  registrationCommands: RegistrationCommandConfig[] = [];

  registrationCommandRules: RegistrationCommandRule = EmptyRegistrationCommandRule;

  partitionKindList: string[] = [];

  tractIndexSelected: TractIndex = EmptyTractIndex;

  amendmentRecordingActSelected: TractIndexEntry = EmptyTractIndexEntry;

  checkBookEntryInput = false;

  isLoadingAmendmentRecordingActs = false;

  widthFirstColumn = '320px';


  constructor(private uiLayer: PresentationLayer,
              private messageBox: MessageBoxService) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit() {
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


  get amendmentRecordingActPlaceholder(): string {
    if (this.registrationCommandRules.selectSubject &&
      this.formHelper.isControlInvalid(this.form.controls.recordableSubject)) {
      return 'Seleccione el folio real';
    }

    if (this.registrationCommandRules.selectBookEntry) {
      if (!this.checkBookEntryInput && !this.form.value.bookEntryUID) {
        return 'Seleccione la inscripción';
      }

      if (this.checkBookEntryInput && !this.form.value.authorizationDate) {
        return 'Seleccione la fecha de la inscripción';
      }
    }

    return 'Seleccione';
  }


  onRecordingActTypeGroupChange(recordingActTypeGroup: RecordingActTypeGroup) {
    this.recordingActTypeList = recordingActTypeGroup.recordingActTypes ?? [];
    this.registrationCommands = [];

    this.form.controls.recordingActType.reset();
    this.form.controls.registrationCommand.reset();

    this.resetRegistrationCommandRules(EmptyRegistrationCommandRule);
  }


  onRecordingActTypeChange(recordingActType: RecordingActType) {
    this.registrationCommands = recordingActType.registrationCommands ?? [];
    this.form.controls.registrationCommand.reset();
    this.resetRegistrationCommandRules(EmptyRegistrationCommandRule);
  }


  onRegistrationCommandChange(registrationCommand: RegistrationCommandConfig){
    this.resetRegistrationCommandRules(registrationCommand.rules);
    this.formHelper.markFormControlsAsTouched(this.form);
  }


  onRecordableSubjectChange(recordableSubject: RecordableSubject) {
    this.validateAmendmentRecordingActFields();
    this.getAmendmentRecordingActs();
  }


  onAmendmentRecordingActChange(recordingAct: TractIndexEntry) {
    this.amendmentRecordingActSelected = isEmpty(recordingAct) ? EmptyTractIndexEntry : recordingAct;
  }


  onRecordingBookSelectorEvent(event: EventInfo){

    switch (event.type as RecordingBookSelectorEventType) {

      case RecordingBookSelectorEventType.RECORDING_BOOK_CHANGED:

        Assertion.assertValue(event.payload.recordingBook, 'event.payload.recordingBook');

        this.form.controls.recordingBook.setValue(event.payload.recordingBook);

        return;

      case RecordingBookSelectorEventType.BOOK_ENTRY_CHANGED:

        Assertion.assertValue(event.payload.bookEntry, 'event.payload.bookEntry');

        const bookEntry = event.payload.bookEntry as BookEntryShortModel;

        if (this.checkBookEntryInput) {
          this.form.controls.bookEntryNo.setValue(bookEntry.recordingNo);
          this.form.controls.presentationTime.setValue(bookEntry.presentationTime);
          this.form.controls.authorizationDate.setValue(bookEntry.authorizationDate);
        } else {
          this.form.controls.bookEntryUID.setValue(bookEntry.uid);
          this.form.controls.authorizationDate.setValue(bookEntry.authorizationDate);
        }

        this.getAmendmentRecordingActs();

        return;

      case RecordingBookSelectorEventType.BOOK_ENTRY_CHECK_CHANGED:

        Assertion.assertValue(event.payload.checkBookEntryInput, 'event.payload.checkBookEntryInput');

        this.setCheckBookEntryInput(event.payload.checkBookEntryInput);

        this.resetAmendmentRecordingActData();

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  async onSubmitClicked() {
    if (!this.formHelper.isFormReadyAndInvalidate(this.form)) {
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
    const fb = new FormBuilder();

    this.form = fb.group({
      recordingActTypeGroup: ['', Validators.required],
      recordingActType: ['', Validators.required],
      registrationCommand: ['', Validators.required],
      recordableSubject: [null],
      recordingBook: [null],
      bookEntryUID: [''],
      bookEntryNo: [''],
      presentationTime: ['' as DateString],
      authorizationDate: ['' as DateString],
      partitionType: [''],
      partitionNo: [''],
      amendmentRecordingActUID: [''],
    });
  }


  private loadDataLists() {
    this.helper.select<string[]>(RecordableSubjectsStateSelector.REAL_ESTATE_PARTITION_KIND_LIST)
      .subscribe(x => this.partitionKindList = x);
  }


  private getAmendmentRecordingActs() {
    const query = this.buildAmendmentRecordingActQuery();

    if (!query.recordableSubjectUID || !query.amendmentRecordingActTypeUID ||
        !(query.authorizationDate || query.instrumentRecordingUID)) {
      this.resetAmendmentRecordingActData();
      return;
    }

    this.isLoadingAmendmentRecordingActs = true;

    this.helper.select<TractIndex>(RecordableSubjectsStateSelector.AMENDABLE_RECORDING_ACTS, {query})
      .firstValue()
      .then(x => this.tractIndexSelected = x)
      .finally(() => this.isLoadingAmendmentRecordingActs = false);
  }


  private buildAmendmentRecordingActQuery(): RecordingActSearchQuery {
    const query: RecordingActSearchQuery = {
      recordableSubjectUID: this.recordableSubjectUID || this.form.value.recordableSubject?.uid,
      amendmentRecordingActTypeUID: this.form.value.recordingActType,
      authorizationDate: this.form.value.authorizationDate,
      instrumentRecordingUID: this.instrumentRecordingUID ?? '',
    };

    return query;
  }


  private resetAmendmentRecordingActData() {
    this.form.controls.amendmentRecordingActUID.reset();
    this.setTractIndexSelected(EmptyTractIndex);
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
    this.form.controls.recordableSubject.reset();

    if (this.registrationCommandRules.selectSubject) {
      this.formHelper.setControlValidators(this.form.controls.recordableSubject, Validators.required);
    } else {
      this.formHelper.clearControlValidators(this.form.controls.recordableSubject);
    }
  }


  private validatePartitionField(){
    this.form.controls.partitionNo.reset();
    this.form.controls.partitionType.reset();

    if (this.registrationCommandRules.newPartition) {
      this.formHelper.setControlValidators(this.form.controls.partitionType, Validators.required);
      this.formHelper.setControlValidators(this.form.controls.partitionNo, Validators.required);
    } else {
      this.formHelper.clearControlValidators(this.form.controls.partitionType);
      this.formHelper.clearControlValidators(this.form.controls.partitionNo);
    }
  }


  private validateRecordingBookFields(){
    if (this.registrationCommandRules.selectBookEntry) {
      this.formHelper.setControlValidators(this.form.controls.recordingBook, Validators.required);
    } else {
      this.formHelper.clearControlValidators(this.form.controls.recordingBook);
      this.form.controls.recordingBook.reset();
    }

    this.validateBookEntryFields();
  }


  private validateBookEntryFields() {
    this.formHelper.clearControlValidators(this.form.controls.bookEntryUID);
    this.formHelper.clearControlValidators(this.form.controls.bookEntryNo);
    this.formHelper.clearControlValidators(this.form.controls.authorizationDate);

    if (this.registrationCommandRules.selectBookEntry) {
      if (this.checkBookEntryInput) {
        this.formHelper.setControlValidators(this.form.controls.bookEntryNo, Validators.required);
        this.formHelper.setControlValidators(this.form.controls.authorizationDate, Validators.required);
      } else {
        this.formHelper.setControlValidators(this.form.controls.bookEntryUID, Validators.required);
      }
    } else {
      this.checkBookEntryInput = false;
      this.form.controls.bookEntryUID.reset();
      this.form.controls.bookEntryNo.reset();
      this.form.controls.authorizationDate.reset();
    }
  }


  private validateAmendmentRecordingActFields(){
    this.form.controls.amendmentRecordingActUID.reset();
    this.amendmentRecordingActSelected = EmptyTractIndexEntry;

    if (this.registrationCommandRules.selectTargetAct) {
      this.formHelper.setControlValidators(this.form.controls.amendmentRecordingActUID, Validators.required);
    } else {
      this.formHelper.clearControlValidators(this.form.controls.amendmentRecordingActUID);
    }
  }


  private setCheckBookEntryInput(checkBookEntryInput: boolean) {
    this.checkBookEntryInput = checkBookEntryInput;

    this.form.controls.bookEntryUID.reset();
    this.form.controls.bookEntryNo.reset();
    this.form.controls.presentationTime.reset();
    this.form.controls.authorizationDate.reset();

    this.validateBookEntryFields();
  }


  private get confirmContinueWithoutPresentationTimeRequired() {
    return this.checkBookEntryInput && !this.form.value.presentationTime;
  }


  private confirmContinueWithoutPresentationTime(): Promise<boolean> {
    const bookEntryNo = this.form.value.bookEntryNo;
    const recordingBookName = this.form.value.recordingBook.name;
    const title = 'Se está omitiendo la fecha de presentación';
    const message = `¿Está seguro que no hay forma de saber cuál fue la fecha de presentación de la ` +
      `<strong>Inscripción ${bookEntryNo} - Volumen ${recordingBookName}</strong>?`;
    return this.messageBox.confirm(message, title).firstValue();
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
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const formModel = this.form.getRawValue();

    const registrationCommandPayload: RegistrationCommandPayload = this.getRegistrationCommandPayload();

    const registrationCommand: RegistrationCommand = {
      type: formModel.registrationCommand,
      payload: registrationCommandPayload
    };

    return registrationCommand;
  }


  private getRegistrationCommandPayload(): RegistrationCommandPayload {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const formModel = this.form.getRawValue();

    let data: RegistrationCommandPayload = {
      recordingActTypeUID: formModel.recordingActType ?? '',
    };

    if (this.registrationCommandRules.selectSubject) {
      data.recordableSubjectUID = !isEmpty(formModel.recordableSubject) ?
        formModel.recordableSubject.uid : '';
    }

    if (this.registrationCommandRules.newPartition) {
      data.partitionType = formModel.partitionType ?? '';
      data.partitionNo = formModel.partitionNo ?? '';
    }

    if (this.registrationCommandRules.selectTargetAct) {
      data.amendedRecordingActUID = formModel.amendmentRecordingActUID ?? '';
    }

    this.validateSelectBookEntryRule(data);

    return data;
  }


  private validateSelectBookEntryRule(data: RegistrationCommandPayload) {
    if (this.registrationCommandRules.selectBookEntry) {
      const formModel = this.form.getRawValue();

      data.recordingBookUID = formModel.recordingBook.uid ?? '';

      if (!this.checkBookEntryInput) {
        data.bookEntryUID = formModel.bookEntryUID ?? '';
      } else {
        data.bookEntryNo = formModel.bookEntryNo ?? '';
        data.authorizationDate = formModel.authorizationDate ?? '';

        if (!!formModel.presentationTime) {
          data.presentationTime = formModel.presentationTime ?? '';
        }
      }
    }
  }

}
