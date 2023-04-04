/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { combineLatest } from 'rxjs';

import { Assertion, Command, Identifiable } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { RegistrationCommandType, TransactionStateSelector } from '@app/core/presentation/presentation-types';

import { InstrumentBookEntryFields, RecordingSection } from '@app/models';

import { FormHelper } from '@app/shared/utils';

interface InstrumentBookEntryFormModel extends FormGroup<{
  recorderOffice: FormControl<string>;
  recordingSection: FormControl<string>;
}> { }


@Component({
  selector: 'emp-land-instrument-land-book-entry-creator',
  templateUrl: './instrument-book-entry-creator.component.html',
})
export class InstrumentBookEntryCreatorComponent implements OnInit, OnDestroy {

  @Input() instrumentRecordingUID = 'Empty';

  recorderOfficeList: Identifiable[] = [];

  recordingSectionList: RecordingSection[] = [];

  helper: SubscriptionHelper;

  form: InstrumentBookEntryFormModel;

  formHelper = FormHelper;

  submitted = false;


  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
    this.initForm();
  }


  ngOnInit() {
    this.loadDataList();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  onSubmitClicked() {
    if (this.submitted || !this.formHelper.isFormReadyAndInvalidate(this.form)) {
      return;
    }

    const payload = {
      instrumentRecordingUID: this.instrumentRecordingUID,
      bookEntryFields: this.getFormData(),
    };

    this.executeCommand(RegistrationCommandType.CREATE_INSTRUMENT_RECORDING_BOOK_ENTRY, payload);
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      recorderOffice: ['', Validators.required],
      recordingSection: ['', Validators.required],
    });
  }


  private loadDataList() {
    combineLatest([
      this.helper.select<Identifiable[]>(TransactionStateSelector.FILING_OFFICE_LIST),
      this.helper.select<RecordingSection[]>(TransactionStateSelector.RECORDING_SECTION_LIST),
    ])
    .subscribe(([a, b]) => {
      this.recorderOfficeList = a;
      this.recordingSectionList = b;
    });
  }


  private getFormData(): InstrumentBookEntryFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const formModel = this.form.getRawValue();

    const data: InstrumentBookEntryFields = {
      recorderOfficeUID: formModel.recorderOffice ?? '',
      sectionUID: formModel.recordingSection ?? '',
    };

    return data;
  }


  private executeCommand<T>(commandType: RegistrationCommandType, payload?: any): Promise<T> {
    this.submitted = true;

    const command: Command = {
      type: commandType,
      payload
    };

    return this.uiLayer.execute<T>(command)
      .finally(() => this.submitted = false);
  }

}
