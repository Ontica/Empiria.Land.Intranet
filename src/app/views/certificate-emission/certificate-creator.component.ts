/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output,
         SimpleChanges } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, Empty, EventInfo, Identifiable, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { FormHandler, sendEvent } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { CertificationDataService } from '@app/data-services';

import { CertificateRules, CertificateType, CreateCertificateCommand, CreateCertificateCommandPayload,
         EmptyCertificateRules, IssuingCommands } from '@app/models';


import {
  RecordingBookSelectorEventType
} from '@app/views/land-controls/recording-book-selector/recording-book-selector.component';

enum CertificateCreatorFormControls {
  certificateType = 'certificateType',
  registrationCommand = 'registrationCommand',
  recordableSubject = 'recordableSubject',
  recordingBook = 'recordingBook',
  bookEntryUID = 'bookEntryUID',
  bookEntryNo = 'bookEntryNo',
  presentationTime = 'presentationTime',
  authorizationDate = 'authorizationDate',
  personName = 'personName',
  realEstateDescription = 'realEstateDescription',
}

export enum CertificateCreatorEventType {
  CREATE_CERTIFICATE = 'CertificateCreatorComponent.Event.CreateCertificate',
}

@Component({
  selector: 'emp-land-certificate-creator',
  templateUrl: './certificate-creator.component.html',
})
export class CertificateCreatorComponent implements OnInit, OnChanges, OnDestroy {

  @Input() transactionUID = '';

  @Input() recorderOffice: Identifiable = Empty;

  @Output() certificateCreatorEvent = new EventEmitter<EventInfo>();

  helper: SubscriptionHelper;

  formHandler: FormHandler;

  controls = CertificateCreatorFormControls;

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


  ngOnInit(): void {
    this.initForm();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  onCertificateTypeChange(certificateType: CertificateType) {
    this.formHandler.getControl(this.controls.registrationCommand).reset();
    this.issuingCommandsList = certificateType.issuingCommands ?? [];
    this.resetCertificateRules(EmptyCertificateRules);
  }


  onIssuingCommandChange(issuingCommand: IssuingCommands){
    this.resetCertificateRules(issuingCommand.rules);
    this.formHandler.invalidateForm();
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


  async onSubmitCertificate() {
    if (!this.formHandler.validateReadyForSubmit()) {
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
    this.formHandler = new FormHandler(
      new FormGroup({
        certificateType: new FormControl('', Validators.required),
        registrationCommand: new FormControl('', Validators.required),
        recordableSubject: new FormControl(''),
        recordingBook: new FormControl(''),
        bookEntryUID: new FormControl(''),
        bookEntryNo: new FormControl(''),
        presentationTime: new FormControl(''),
        authorizationDate: new FormControl(''),
        personName: new FormControl(''),
        realEstateDescription: new FormControl(''),
      })
    );
  }


  private getCertificateTypes() {
    this.isLoading = true;
    this.certificationData.getTransactionCertificateTypes(this.transactionUID)
      .toPromise()
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
    this.formHandler.getControl(this.controls.recordableSubject).reset();

    if (this.certificateRulesSelected.selectSubject) {
      this.formHandler.setControlValidators(this.controls.recordableSubject, Validators.required);
    } else {
      this.formHandler.clearControlValidators(this.controls.recordableSubject);
    }
  }


  private validateRecordingBookFields(){
    if (this.certificateRulesSelected.selectBookEntry) {
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

    if (this.certificateRulesSelected.selectBookEntry) {
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


  private validatePersonNameField(){
    this.formHandler.getControl(this.controls.personName).reset();

    if (this.certificateRulesSelected.givePersonName) {
      this.formHandler.setControlValidators(this.controls.personName, Validators.required);
    } else {
      this.formHandler.clearControlValidators(this.controls.personName);
    }
  }


  private validateRealEstateDescriptionField(){
    this.formHandler.getControl(this.controls.realEstateDescription).reset();

    if (this.certificateRulesSelected.giveRealEstateDescription) {
      this.formHandler.setControlValidators(this.controls.realEstateDescription, Validators.required);
    } else {
      this.formHandler.clearControlValidators(this.controls.realEstateDescription);
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


  private emitCreateCertificate() {
    const command: CreateCertificateCommand = this.getCreateCertificateCommand();

    const payload = {
      transactionUID: this.transactionUID,
      command,
    };

    sendEvent(this.certificateCreatorEvent, CertificateCreatorEventType.CREATE_CERTIFICATE, payload);
  }


  private getCreateCertificateCommand(): CreateCertificateCommand {
    Assertion.assert(this.formHandler.form.valid,
      'Programming error: form must be validated before command execution.');

    const formModel = this.formHandler.form.getRawValue();

    const payload: CreateCertificateCommandPayload = this.getCreateCertificateCommandPayload();

    const command: CreateCertificateCommand = {
      type: formModel.registrationCommand,
      payload
    };

    return command;
  }


  private getCreateCertificateCommandPayload(): CreateCertificateCommandPayload {
    Assertion.assert(this.formHandler.form.valid,
      'Programming error: form must be validated before command execution.');

    const formModel = this.formHandler.form.getRawValue();

    let data: CreateCertificateCommandPayload = {
      certificateTypeUID: formModel.certificateType ?? '',
    };

    this.validateFieldsByCertificateRule(data);

    return data;
  }


  private validateFieldsByCertificateRule(data: CreateCertificateCommandPayload) {
    const formModel = this.formHandler.form.getRawValue();

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
      const formModel = this.formHandler.form.getRawValue();

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
