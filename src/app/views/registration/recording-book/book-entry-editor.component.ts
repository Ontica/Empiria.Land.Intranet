/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { EventInfo, isEmpty } from '@app/core';

import { BookEntry, CreateManualBookEntryFields, EmptyBookEntry, EmptyInstrument,
         EmptyInstrumentRecordingActions, Instrument, InstrumentFields,
         InstrumentRecordingActions } from '@app/models';

import { FormHandler } from '@app/shared/utils';

import {
  InstrumentEditorEventType
} from '@app/views/recordable-subjects/instrument/instrument-editor.component';

enum BookEntryEditorControls {
  recordingNo = 'recordingNo',
  authorizationDate = 'authorizationDate',
  presentationTime = 'presentationTime',
}

export enum BookEntryEditorEventType {
  CREATE_BOOK_ENTRY = 'BookEntryEditorComponent.Event.CreateBookEntry',
  UPDATE_BOOK_ENTRY = 'BookEntryEditorComponent.Event.UpdateBookEntry',
}


@Component({
  selector: 'emp-land-book-entry-editor',
  templateUrl: './book-entry-editor.component.html',
})

export class BookEntryEditorComponent implements OnInit, OnChanges {

  @Input() bookEntry: BookEntry = EmptyBookEntry;

  @Input() instrument: Instrument = EmptyInstrument;

  @Input() actions: InstrumentRecordingActions = EmptyInstrumentRecordingActions;

  @Output() bookEntryEditorEvent = new EventEmitter<EventInfo>();

  formHandler: FormHandler;

  controls = BookEntryEditorControls;

  editionMode = false;

  constructor() {
    this.initForm();
  }


  ngOnInit(): void {
    this.setEditionMode(!isEmpty(this.bookEntry));
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.bookEntry) {
      this.resetFormModel();
    }
  }


  onInstrumentEditorEvent(event) {

    switch (event.type as InstrumentEditorEventType) {

      case InstrumentEditorEventType.CREATE_INSTRUMENT:

        if (!this.formHandler.isValid) {
          return;
        }

        this.sendEvent(BookEntryEditorEventType.CREATE_BOOK_ENTRY,
          this.getFormData(event.payload.instrumentFields as InstrumentFields));

        return;

      case InstrumentEditorEventType.UPDATE_INSTRUMENT:

        if (!this.formHandler.isValid) {
          return;
        }

        this.sendEvent(BookEntryEditorEventType.UPDATE_BOOK_ENTRY,
          this.getFormData(event.payload.instrumentFields as InstrumentFields));

        return;

      case InstrumentEditorEventType.EDITION_MODE_CHANGED:
        this.setEditionMode(event.payload);

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private initForm() {
    this.formHandler = new FormHandler(
      new FormGroup({
        recordingNo: new FormControl('', Validators.required),
        authorizationDate: new FormControl('', Validators.required),
        presentationTime: new FormControl('', Validators.required),
      }));
  }


  private resetFormModel() {
    this.formHandler.form.reset({
      recordingNo: this.bookEntry.recordingNo,
      authorizationDate: '', // this.bookEntry.recordingTime,
      presentationTime: '', // this.bookEntry.recordingTime,
    });
  }


  private setEditionMode(editionMode: boolean) {
    setTimeout(() => {
      this.editionMode = editionMode;
      this.resetFormModel();
      this.formHandler.disableForm(!this.editionMode);
    });
  }


  private getFormData(instrument: InstrumentFields): CreateManualBookEntryFields {
    const bookEntryFields: CreateManualBookEntryFields = {
      recordingNo: this.formHandler.getControl(this.controls.recordingNo).value,
      authorizationDate: this.formHandler.getControl(this.controls.authorizationDate).value,
      presentationTime: this.formHandler.getControl(this.controls.presentationTime).value,
      instrument,
    };

    return bookEntryFields;
  }


  private sendEvent(eventType: BookEntryEditorEventType, payload?: any) {
    const event: EventInfo = {
      type: eventType,
      payload
    };

    this.bookEntryEditorEvent.emit(event);
  }

}
