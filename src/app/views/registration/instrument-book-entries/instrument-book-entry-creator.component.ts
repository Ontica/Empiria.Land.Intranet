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

import { RegistrationCommandType,
         TransactionStateSelector } from '@app/core/presentation/presentation-types';

import { BookEntryFields, RecordingSection } from '@app/models';

import { FormHandler } from '@app/shared/utils';


enum InstrumentBookEntryCreatorFormControls {
  recorderOffice = 'recorderOffice',
  recordingSection = 'recordingSection',
}


@Component({
  selector: 'emp-instrument-land-book-entry-creator',
  templateUrl: './instrument-book-entry-creator.component.html',
})
export class InstrumentBookEntryCreatorComponent implements OnInit, OnDestroy {

  @Input() instrumentRecordingUID: string = 'Empty';

  recorderOfficeList: Identifiable[] = [];

  recordingSectionList: RecordingSection[] = [];

  helper: SubscriptionHelper;

  formHandler: FormHandler;

  controls = InstrumentBookEntryCreatorFormControls;

  submitted = false;

  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
  }

  ngOnInit(): void {
    this.initForm();
    this.loadData();
  }

  ngOnDestroy() {
    this.helper.destroy();
  }

  createBookEntry() {
    if (this.submitted || !this.formHandler.validateReadyForSubmit()) {
      return;
    }

    const payload = {
      instrumentRecordingUID: this.instrumentRecordingUID,
      bookEntryFields: this.getFormData()
    };

    this.executeCommand(RegistrationCommandType.CREATE_RECORDING_BOOK_ENTRY, payload);
  }


  private initForm() {
    this.formHandler = new FormHandler(
      new FormGroup({
        recorderOffice: new FormControl('', Validators.required),
        recordingSection: new FormControl('', Validators.required),
      })
    );
  }


  private loadData() {
    this.helper.select<Identifiable[]>(TransactionStateSelector.FILING_OFFICE_LIST)
      .subscribe(x => {
        this.recorderOfficeList = x;
      });

    this.helper.select<RecordingSection[]>(TransactionStateSelector.RECORDING_SECTION_LIST)
      .subscribe(x => {
        this.recordingSectionList = x;
      });
  }


  private getFormData(): BookEntryFields {
    Assertion.assert(this.formHandler.form.valid,
      'Programming error: form must be validated before command execution.');

    const formModel = this.formHandler.form.getRawValue();

    const data: BookEntryFields = {
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
