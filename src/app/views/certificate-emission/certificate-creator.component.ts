/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output,
         SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, Empty, EventInfo, Identifiable, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { FormHelper, sendEvent } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/services';

import { CertificationDataService } from '@app/data-services';

import { CertificateRules, CertificateType, CreateCertificateCommand, CreateCertificateCommandPayload,
         EmptyCertificateRules, IssuingCommands } from '@app/models';

import {
  RecordingBookSelectorEventType
} from '@app/views/land-controls/recording-book-selector/recording-book-selector.component';


export enum CertificateCreatorEventType {
  CREATE_CERTIFICATE = 'CertificateCreatorComponent.Event.CreateCertificate',
}

interface CertificateFormModel extends FormGroup<{
  certificateType: FormControl<string>;
  registrationCommand: FormControl<string>;
  recordableSubject: FormControl<Identifiable>;
  recordingBook: FormControl<Identifiable>;
  bookEntryUID: FormControl<string>;
  bookEntryNo: FormControl<string>;
  presentationTime: FormControl<string>;
  authorizationDate: FormControl<string>;
  personName: FormControl<string>;
  realEstateDescription: FormControl<string>;
}> {}

@Component({
  selector: 'emp-land-certificate-creator',
  templateUrl: './certificate-creator.component.html',
})
export class CertificateCreatorComponent implements OnInit, OnChanges, OnDestroy {

  @Input() transactionUID = '';

  @Input() recorderOffice: Identifiable = Empty;

  @Output() certificateCreatorEvent = new EventEmitter<EventInfo>();

  helper: SubscriptionHelper;

  form: CertificateFormModel;

  formHelper = FormHelper;

  certificateTypesList: CertificateType[] = [];

  issuingCommandsList: IssuingCommands[] = [];

  certificateRulesSelected: CertificateRules = EmptyCertificateRules;

  checkBookEntryInput = false;

  isLoading = false;


  constructor(private certificationData: CertificationDataService,
              private uiLayer: PresentationLayer,
              private messageBox: MessageBoxService){
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.transactionUID) {
      this.getCertificateTypes();
    }
  }


  ngOnInit() {
    this.initForm();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  onCertificateTypeChanges(certificateType: CertificateType) {
    this.form.controls.registrationCommand.reset();
    this.issuingCommandsList = certificateType.issuingCommands ?? [];
    this.resetCertificateRules(EmptyCertificateRules);
  }


  onIssuingCommandChanges(issuingCommand: IssuingCommands){
    this.resetCertificateRules(issuingCommand.rules);
    this.formHelper.markFormControlsAsTouched(this.form);
  }


  onBookEntryCheckChanges() {
    this.form.controls.bookEntryUID.reset();
    this.form.controls.bookEntryNo.reset();
    this.form.controls.presentationTime.reset();
    this.form.controls.authorizationDate.reset();

    this.validateBookEntryFields();
  }


  onRecordingBookSelectorEvent(event: EventInfo){
    switch (event.type as RecordingBookSelectorEventType) {

      case RecordingBookSelectorEventType.RECORDING_BOOK_CHANGED:
        Assertion.assertValue(event.payload.recordingBook, 'event.payload.recordingBook');
        this.form.controls.recordingBook.setValue(event.payload.recordingBook);
        return;

      case RecordingBookSelectorEventType.BOOK_ENTRY_CHANGED:
        Assertion.assertValue(event.payload.bookEntry, 'event.payload.bookEntry');
        const bookEntry = event.payload.bookEntry;

        if (this.checkBookEntryInput) {
          this.form.controls.bookEntryNo.setValue(bookEntry.recordingNo);
          this.form.controls.presentationTime.setValue(bookEntry.presentationTime);
          this.form.controls.authorizationDate.setValue(bookEntry.authorizationDate);
        } else {
          this.form.controls.bookEntryUID.setValue(bookEntry.uid);
        }

        return;

      case RecordingBookSelectorEventType.BOOK_ENTRY_CHECK_CHANGED:
        Assertion.assertValue(event.payload.checkBookEntryInput, 'event.payload.checkBookEntryInput');
        this.setCheckBookEntryInput(event.payload.checkBookEntryInput)
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  async onSubmitCertificate() {
    if (!this.formHelper.isFormReadyAndInvalidate(this.form)) {
      return;
    }

    if (this.confirmContinueWithoutPresentationTimeRequired &&
        !await this.confirmContinueWithoutPresentationTime()) {
      return;
    } else {
      this.emitCreateCertificate();
    }
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      certificateType: ['', Validators.required],
      registrationCommand: ['', Validators.required],
      recordableSubject: [null],
      recordingBook: [null],
      bookEntryUID: [''],
      bookEntryNo: [''],
      presentationTime: [''],
      authorizationDate: [''],
      personName: [''],
      realEstateDescription: [''],
    });
  }


  private getCertificateTypes() {
    this.isLoading = true;
    this.certificationData.getTransactionCertificateTypes(this.transactionUID)
      .firstValue()
      .then(x => this.certificateTypesList = x)
      .finally(() => this.isLoading = false);
  }


  private resetCertificateRules(rules: CertificateRules) {
    this.setCertificateRulesSelected(rules);
    this.validateRecordableSubjectField();
    this.validateRecordingBookFields();
    this.validatePersonNameField();
    this.validateRealEstateDescriptionField();
  }


  private setCertificateRulesSelected(rules: CertificateRules){
    this.certificateRulesSelected = rules;
  }


  private validateRecordableSubjectField(){
    this.form.controls.recordableSubject.reset();

    if (this.certificateRulesSelected.selectSubject) {
      this.formHelper.setControlValidators(this.form.controls.recordableSubject, Validators.required);
    } else {
      this.formHelper.clearControlValidators(this.form.controls.recordableSubject);
    }
  }


  private validateRecordingBookFields(){
    if (this.certificateRulesSelected.selectBookEntry) {
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

    if (this.certificateRulesSelected.selectBookEntry) {
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


  private validatePersonNameField(){
    this.form.controls.personName.reset();

    if (this.certificateRulesSelected.givePersonName) {
      this.formHelper.setControlValidators(this.form.controls.personName, Validators.required);
    } else {
      this.formHelper.clearControlValidators(this.form.controls.personName);
    }
  }


  private validateRealEstateDescriptionField(){
    this.form.controls.realEstateDescription.reset();

    if (this.certificateRulesSelected.giveRealEstateDescription) {
      this.formHelper.setControlValidators(this.form.controls.realEstateDescription, Validators.required);
    } else {
      this.formHelper.clearControlValidators(this.form.controls.realEstateDescription);
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
    const recordingBook = this.form.value.recordingBook;
    const bookEntryNo = this.form.value.bookEntryNo;
    const title = 'Se está omitiendo la fecha de presentación';
    const message = `¿Está seguro que no hay forma de saber cuál fue la fecha de presentación de la ` +
      `<strong>Inscripción ${bookEntryNo} - Volumen ${recordingBook.name}</strong>?`;
    return this.messageBox.confirm(message, title).firstValue();
  }


  private emitCreateCertificate() {
    const payload = {
      transactionUID: this.transactionUID,
      command: this.getCreateCertificateCommand(),
    };

    sendEvent(this.certificateCreatorEvent, CertificateCreatorEventType.CREATE_CERTIFICATE, payload);
  }


  private getCreateCertificateCommand(): CreateCertificateCommand {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const formModel = this.form.getRawValue();

    const payload: CreateCertificateCommandPayload = this.getCreateCertificateCommandPayload();

    const command: CreateCertificateCommand = {
      type: formModel.registrationCommand,
      payload
    };

    return command;
  }


  private getCreateCertificateCommandPayload(): CreateCertificateCommandPayload {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const formModel = this.form.getRawValue();

    let data: CreateCertificateCommandPayload = {
      certificateTypeUID: formModel.certificateType ?? '',
    };

    this.validateFieldsByCertificateRule(data);

    return data;
  }


  private validateFieldsByCertificateRule(data: CreateCertificateCommandPayload) {
    const formModel = this.form.getRawValue();

    if (this.certificateRulesSelected.selectSubject) {
      data.recordableSubjectUID =
        !isEmpty(formModel.recordableSubject) ? formModel.recordableSubject.uid : '';
    }

    if (this.certificateRulesSelected.givePersonName) {
      data.personName = formModel.personName ?? '';
    }

    if (this.certificateRulesSelected.giveRealEstateDescription) {
      data.realEstateDescription = formModel.realEstateDescription ?? '';
    }

    this.validateSelectBookEntryRule(data);
  }


  private validateSelectBookEntryRule(data: CreateCertificateCommandPayload) {
    if (this.certificateRulesSelected.selectBookEntry) {
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
