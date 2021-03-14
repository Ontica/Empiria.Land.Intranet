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
import { InstrumentsCommandType, TransactionStateSelector } from '@app/core/presentation/presentation-types';

import { Instrument, BookEntryFields, RecordingSection } from '@app/models';

import { FormHandler } from '@app/shared/utils';


enum BookEntryCreatorFormControls {
  recorderOffice = 'recorderOffice',
  recordingSection = 'recordingSection',
}


@Component({
  selector: 'emp-land-book-entry-creator',
  templateUrl: './book-entry-creator.component.html',
})
export class BookEntryCreatorComponent implements OnInit, OnDestroy {

  @Input() transactionUID: string;

  @Input() instrumentUID: string;

  recorderOfficeList: Identifiable[] = [];

  recordingSectionList: RecordingSection[] = [];

  helper: SubscriptionHelper;

  formHandler: FormHandler;

  controls = BookEntryCreatorFormControls;

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
      transactionUID: this.transactionUID,
      instrumentUID: this.instrumentUID,
      physicalRecording: this.getFormData()
    };

    this.executeCommand<Instrument>(InstrumentsCommandType.CREATE_PHYSICAL_RECORDING, payload);
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
    this.helper.select<Identifiable[]>(TransactionStateSelector.FILING_OFFICE_LIST, {})
      .subscribe(x => {
        this.recorderOfficeList = x;
      });

    this.helper.select<RecordingSection[]>(TransactionStateSelector.RECORDING_SECTION_LIST, {})
      .subscribe(x => {
        this.recordingSectionList = x;
      });
  }


  private getFormData(): any {
    Assertion.assert(this.formHandler.form.valid,
      'Programming error: form must be validated before command execution.');

    const formModel = this.formHandler.form.getRawValue();

    const data: BookEntryFields = {
      recorderOfficeUID: formModel.recorderOffice ?? '',
      sectionUID: formModel.recordingSection ?? '',
    };

    return data;
  }


  private executeCommand<T>(commandType: InstrumentsCommandType, payload?: any): Promise<T> {
    this.submitted = true;

    const command: Command = {
      type: commandType,
      payload
    };

    return this.uiLayer.execute<T>(command)
      .finally(() => this.submitted = false);
  }

}
