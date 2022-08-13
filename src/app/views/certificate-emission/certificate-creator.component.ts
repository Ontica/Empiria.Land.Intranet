/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output,
         SimpleChanges } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { concat, Observable, of, Subject } from 'rxjs';

import { catchError, debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs/operators';

import { Assertion, Empty, EventInfo, Identifiable } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { RecordableSubjectsStateSelector } from '@app/presentation/exported.presentation.types';

import { CertificationDataService } from '@app/data-services';

import { CertificateRules, CertificateType, CreateCertificateCommand, CreateCertificateCommandPayload,
         EmptyCertificateRules, IssuingCommands, RecordableSubjectFilter,
         RecordableSubjectShortModel } from '@app/models';

import { FormHandler, sendEvent } from '@app/shared/utils';

import {
  RecordingBookSelectorEventType
} from '@app/views/land-controls/recording-book-selector/recording-book-selector.component';

enum CertificateCreatorFormControls {
  certificateType = 'certificateType',
  registrationCommand = 'registrationCommand',
  recordableSubjectUID = 'recordableSubjectUID',
  recordingBookUID = 'recordingBookUID',
  bookEntryNo = 'bookEntryNo',
  bookEntryUID = 'bookEntryUID',
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

  recordableSubjectList$: Observable<RecordableSubjectShortModel[]>;
  recordableSubjectInput$ = new Subject<string>();
  recordableSubjectLoading = false;
  recordableSubjectMinTermLength = 5;

  checkBookEntryInput = false;

  isLoading = false;


  constructor(private certificationData: CertificationDataService,
              private uiLayer: PresentationLayer){
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.transactionUID) {
      this.getCertificateTypes();
    }
  }


  ngOnInit(): void {
    this.initForm();
    this.subscribeRecordableSubjectList();
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


  onSubmitCertificate() {
    if (!this.formHandler.validateReadyForSubmit()) {
      return;
    }

    const command: CreateCertificateCommand = this.getCreateCertificateCommand();

    const payload = {
      transactionUID: this.transactionUID,
      command,
    };

    sendEvent(this.certificateCreatorEvent, CertificateCreatorEventType.CREATE_CERTIFICATE, payload);
  }


  private initForm() {
    this.formHandler = new FormHandler(
      new FormGroup({
        certificateType: new FormControl('', Validators.required),
        registrationCommand: new FormControl('', Validators.required),
        recordableSubjectUID: new FormControl(''),
        recordingBookUID: new FormControl(''),
        bookEntryUID: new FormControl(''),
        bookEntryNo: new FormControl(''),
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


  private subscribeRecordableSubjectList() {
    this.recordableSubjectList$ = concat(
      of([]),
      this.recordableSubjectInput$.pipe(
          filter(keyword => this.validRecordableSubjectFilter(keyword)),
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

  private validRecordableSubjectFilter(keyword: string): boolean {
    return !!this.certificateRulesSelected.subjectType &&
      keyword !== null && keyword.length >= this.recordableSubjectMinTermLength
  }


  private buildRecordableSubjectFilter(keywords: string): RecordableSubjectFilter {
    const recordableSubjectFilter: RecordableSubjectFilter = {
      type: this.certificateRulesSelected.subjectType,
      keywords
    };

    return recordableSubjectFilter;
  }


  private resetCertificateRules(rules: CertificateRules) {
    this.setCertificateRulesSelected(rules);
    this.validateRecordableSubjectField();
    this.validateRecordingBookFields();
  }


  private setCertificateRulesSelected(rules: CertificateRules){
    this.certificateRulesSelected = rules;
  }


  private validateRecordableSubjectField(){
    this.formHandler.getControl(this.controls.recordableSubjectUID).reset();

    if (this.certificateRulesSelected.selectSubject) {
      this.formHandler.setControlValidators(this.controls.recordableSubjectUID, Validators.required);
    } else {
      this.formHandler.clearControlValidators(this.controls.recordableSubjectUID);
    }
  }


  private validateRecordingBookFields(){
    if (this.certificateRulesSelected.selectBookEntry) {
      this.formHandler.setControlValidators(this.controls.recordingBookUID, Validators.required);
    } else {
      this.formHandler.clearControlValidators(this.controls.recordingBookUID);
      this.formHandler.getControl(this.controls.recordingBookUID).reset();
    }

    this.validateBookEntryFields();
  }


  private validateBookEntryFields() {
    this.formHandler.clearControlValidators(this.controls.bookEntryUID);
    this.formHandler.clearControlValidators(this.controls.bookEntryNo);

    if (this.certificateRulesSelected.selectBookEntry) {
      if (this.checkBookEntryInput) {
        this.formHandler.setControlValidators(this.controls.bookEntryNo, Validators.required);
      } else {
        this.formHandler.setControlValidators(this.controls.bookEntryUID, Validators.required);
      }
    } else {
      this.checkBookEntryInput = false;
      this.formHandler.getControl(this.controls.bookEntryUID).reset();
      this.formHandler.getControl(this.controls.bookEntryNo).reset();
    }
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

    let payload: CreateCertificateCommandPayload = {
      certificateTypeUID: formModel.certificateType ?? '',
    };

    if (this.certificateRulesSelected.selectSubject) {
      payload.recordableSubjectUID = formModel.recordableSubjectUID ?? '';
    }

    if (this.certificateRulesSelected.selectBookEntry) {
      payload.recordingBookUID = formModel.recordingBookUID ?? '';
      payload.bookEntryUID = !this.checkBookEntryInput ? formModel.bookEntryUID ?? '' : '';
      payload.bookEntryNo = this.checkBookEntryInput ? formModel.bookEntryNo ?? '' : '';
    }

    return payload;
  }
}
