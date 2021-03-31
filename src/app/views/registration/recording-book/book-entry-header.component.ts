/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Assertion, EventInfo, isEmpty } from '@app/core';
import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';
import { BookEntry, BookEntryFields, EmptyBookEntry, InstrumentTypesList } from '@app/models';
import { FormHandler } from '@app/shared/utils';

enum BookEntryHeaderControls {
  type = 'type',
  recordingTime = 'recordingTime',
  volumeNo = 'volumeNo',
  notes = 'notes',
  status = 'status',
}

export enum BookEntryHeaderEventType {
  ADD_BOOK_ENTRY = 'BookEntryHeaderEventType.Event.AddBookEntry',
  UPDATE_BOOK_ENTRY = 'BookEntryHeaderEventType.Event.UpdateBookEntry'
}

@Component({
  selector: 'emp-land-book-entry-header',
  templateUrl: './book-entry-header.component.html',
})
export class BookEntryHeaderComponent implements OnInit, OnChanges, OnDestroy {

  @Input() bookEntry: BookEntry = EmptyBookEntry;

  @Output() bookEntryHeaderEvent = new EventEmitter<EventInfo>();

  helper: SubscriptionHelper;

  formHandler: FormHandler;
  controls = BookEntryHeaderControls;
  editorMode = false;
  readonly = false;
  isLoading = false;

  instrumentTypesList = [];
  statusList = [];

  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
  }

  ngOnChanges(): void {
    this.editorMode = !isEmpty(this.bookEntry);
    this.readonly = this.editorMode;
  }

  ngOnInit(): void {
    this.initForm();
    this.loadDataLists();
    this.disableForm(this.readonly);

    if (this.editorMode) {
      this.setFormData();
    }
  }

  ngOnDestroy() {
    this.helper.destroy();
  }

  enableEditor(enable) {
    this.readonly = !enable;
    this.setFormData();
    this.disableForm(this.readonly);
  }


  onSubmitClicked(){
    if (!this.formHandler.isReadyForSubmit) {
      return this.formHandler.invalidateForm();
    }

    const payload = {
      recordignBookUID: this.bookEntry.uid,
      bookEntry: this.getFormData()
    };

    this.sendEvent(this.editorMode ?
                   BookEntryHeaderEventType.UPDATE_BOOK_ENTRY :
                   BookEntryHeaderEventType.ADD_BOOK_ENTRY,
                   payload);
  }


  private initForm() {
    this.formHandler = new FormHandler(
      new FormGroup({
        type: new FormControl('', Validators.required),
        recordingTime: new FormControl('', Validators.required),
        volumeNo: new FormControl('', Validators.required),
        notes: new FormControl('', Validators.required),
        status: new FormControl(''),
      })
    );
  }

  private loadDataLists() {
    // TODO: define the WS to use
    this.instrumentTypesList = InstrumentTypesList;
    this.statusList = [{uid: 'completed', name: 'Completa'}];
  }


  private setFormData() {
    if (!this.bookEntry) {
      this.formHandler.form.reset();
      return;
    }

    this.formHandler.form.reset({
      type: this.bookEntry.type || '',
      recordingTime: this.bookEntry.recordingTime || '',
      volumeNo: this.bookEntry.volumeNo || '',
      notes: this.bookEntry.notes || '',
      status: this.bookEntry.status || '',
    });
  }


  private disableForm(disable) {
    this.formHandler.disableForm(disable);
  }


  private getFormData(): BookEntryFields {
    Assertion.assert(this.formHandler.form.valid,
      'Programming error: form must be validated before command execution.');

    const formModel = this.formHandler.form.getRawValue();

    const data: BookEntryFields = {
      type: formModel.type ?? '',
      recordingTime: formModel.recordingTime ?? '',
      volumeNo: formModel.volumeNo ?? '',
      notes: formModel.notes ?? '',
      status: formModel.status ?? '',
    };

    return data;
  }


  private sendEvent(eventType: BookEntryHeaderEventType, payload?: any) {
    const event: EventInfo = {
      type: eventType,
      payload
    };

    this.bookEntryHeaderEvent.emit(event);
  }

}
