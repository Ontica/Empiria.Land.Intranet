/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { DateString, EventInfo, isEmpty } from '@app/core';

import { BookEntry, ManualBookEntryFields, EmptyBookEntry, EmptyInstrument,
         EmptyInstrumentRecordingActions, Instrument, InstrumentFields,
         InstrumentRecordingActions,
         InstrumentType} from '@app/models';

import { FormHelper, sendEvent } from '@app/shared/utils';

import {
  InstrumentEditorEventType
} from '@app/views/recordable-subjects/instrument/instrument-editor.component';

export enum BookEntryEditorEventType {
  CREATE_BOOK_ENTRY = 'BookEntryEditorComponent.Event.CreateBookEntry',
  UPDATE_BOOK_ENTRY = 'BookEntryEditorComponent.Event.UpdateBookEntry',
}

interface BookEntryFormModel extends FormGroup<{
  recordingNo: FormControl<string>;
  authorizationDate: FormControl<DateString>;
  presentationTime: FormControl<DateString>;
}> { }

@Component({
  selector: 'emp-land-book-entry-editor',
  templateUrl: './book-entry-editor.component.html',
})

export class BookEntryEditorComponent implements OnInit, OnChanges {

  @Input() bookEntry: BookEntry = EmptyBookEntry;

  @Input() instrument: Instrument = EmptyInstrument;

  @Input() actions: InstrumentRecordingActions = EmptyInstrumentRecordingActions;

  @Output() bookEntryEditorEvent = new EventEmitter<EventInfo>();

  form: BookEntryFormModel;

  editionMode = false;

  defaultInstrumentType = InstrumentType.Resumen;

  constructor() {
    this.initForm();
  }


  ngOnInit() {
    this.setEditionMode(!isEmpty(this.bookEntry));
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.bookEntry) {
      this.setFormData();
    }
  }


  onInstrumentEditorEvent(event: EventInfo) {
    switch (event.type as InstrumentEditorEventType) {

      case InstrumentEditorEventType.CREATE_INSTRUMENT:

        if (FormHelper.isFormReady(this.form)) {
          sendEvent(this.bookEntryEditorEvent, BookEntryEditorEventType.CREATE_BOOK_ENTRY,
            this.getFormData(event.payload.instrumentFields as InstrumentFields));
        }

        return;

      case InstrumentEditorEventType.UPDATE_INSTRUMENT:

        if (this.form.valid) {
          sendEvent(this.bookEntryEditorEvent, BookEntryEditorEventType.UPDATE_BOOK_ENTRY,
            this.getFormData(event.payload.instrumentFields as InstrumentFields));
        }

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
    const fb = new FormBuilder();

    this.form = fb.group({
      recordingNo: ['', Validators.required],
      presentationTime: [null],
      authorizationDate: [null as DateString, [Validators.required]],
    });
  }


  private setFormData() {
    this.form.reset({
      recordingNo: this.bookEntry.recordingNo,
      presentationTime: this.bookEntry.presentationTime,
      authorizationDate: this.bookEntry.authorizationDate,
    });
  }


  private setEditionMode(editionMode: boolean) {
    setTimeout(() => {
      this.editionMode = editionMode;
      this.setFormData();
      FormHelper.setDisableForm(this.form, !this.editionMode);
    });
  }


  private getFormData(instrument: InstrumentFields): ManualBookEntryFields {
    const bookEntryFields: ManualBookEntryFields = {
      bookEntry : {
        recordingNo: this.form.value.recordingNo,
        presentationTime: this.form.value.presentationTime,
        authorizationDate: this.form.value.authorizationDate
      },
      instrument
    };

    return bookEntryFields;
  }

}
