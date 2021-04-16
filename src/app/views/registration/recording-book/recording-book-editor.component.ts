/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, OnChanges, OnInit, Output } from '@angular/core';
import { Assertion, EventInfo, Identifiable, isEmpty } from '@app/core';
import { BookEntryShortModel, CreateManualBookEntryFields, EmptyRecordingBook, InstrumentFields,
         RecordingBook, EmptyBookEntryShortModel } from '@app/models';
import { BookEntryListEventType } from './book-entry-list.component';
import {
  InstrumentEditorEventType
} from '@app/views/recordable-subjects/instrument/instrument-editor.component';
import { RecordingBookSelectorEventType } from './recording-book-selector.component';
import { RecordingDataService } from '@app/data-services';

export enum RecordingBookEditorEventType {
  BOOK_ENTRY_SELECTED = 'RecordingBookEditorComponent.Event.BookEntrySelected',
}

@Component({
  selector: 'emp-land-recording-book-editor',
  templateUrl: './recording-book-editor.component.html',
})
export class RecordingBookEditorComponent implements OnInit, OnChanges {

  @Output() recordingBookEditorEvent = new EventEmitter<EventInfo>();

  cardHint = 'Seleccione el volumen';

  isLoading = false;

  panelAddState = false;

  submitted = false;

  statusList = [];

  recordingBookSelected: RecordingBook = EmptyRecordingBook;

  bookEntrySelected: BookEntryShortModel = EmptyBookEntryShortModel;

  displayRecordingBookEditor = false;

  constructor(private data: RecordingDataService ) { }

  ngOnInit(): void {
    this.initTexts();
  }


  ngOnChanges() {
  }


  onRecordingBookSelectorEvent(event){
    switch (event.type as RecordingBookSelectorEventType) {

      case RecordingBookSelectorEventType.RECORDING_BOOK_CHANGED:

        Assertion.assertValue(event.payload.recordingBook, 'event.payload.recordingBook');

        this.resetPanelState();

        this.loadRecordingBookData(event.payload.recordingBook);

        return;

      case RecordingBookSelectorEventType.BOOK_ENTRY_CHANGED:

        this.sendEvent(RecordingBookEditorEventType.BOOK_ENTRY_SELECTED, event.payload);

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onBookEntryListEvent(event) {
    if (this.submitted) {
      return;
    }

    switch (event.type as BookEntryListEventType) {

      case BookEntryListEventType.BOOK_ENTRY_CLICKED:

        Assertion.assertValue(event.payload.bookEntry, 'event.payload.bookEntry');
        Assertion.assertValue(event.payload.bookEntry.instrumentRecording,
          'event.payload.bookEntry.instrumentRecording');

        this.bookEntrySelected = {
          uid: event.payload.bookEntry.uid,
          recordingNo: event.payload.bookEntry.recordingNo,
          instrumentRecordingUID: event.payload.bookEntry.instrumentRecording.uid,
        };

        this.sendEvent(RecordingBookEditorEventType.BOOK_ENTRY_SELECTED,
          { bookEntry: this.bookEntrySelected });

        return;

      case BookEntryListEventType.DELETE_BOOK_ENTRY_CLICKED:

        Assertion.assertValue(event.payload.bookEntry.bookEntryUID, 'event.payload.bookEntry.bookEntryUID');

        this.deleteBookEntry(event.payload.bookEntry.bookEntryUID);

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onInstrumentEditorEvent(event) {
    if (this.submitted) {
      return;
    }

    switch (event.type as InstrumentEditorEventType) {

      case InstrumentEditorEventType.CREATE_INSTRUMENT:
        Assertion.assertValue(event.payload.instrumentFields, 'event.payload.instruementFields');
        Assertion.assertValue(event.payload, 'event.payload');

        this.createBookEntry(event.payload);

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private initTexts(){
    if (isEmpty(this.recordingBookSelected)) {
      this.cardHint = 'Seleccione el volumen';
      return;
    }

    this.cardHint = 'Volumen ' + this.recordingBookSelected.volumeNo + ', ' +
      this.recordingBookSelected.recordingSection.name + ', ' +
      this.recordingBookSelected.recorderOffice.name;
  }


  private loadRecordingBookData(recordingBook: Identifiable){
    if (isEmpty(recordingBook)) {
      this.recordingBookSelected = EmptyRecordingBook;
      this.displayRecordingBookEditor = false;
      this.initTexts();

      return;
    }

    this.isLoading = true;

    this.data.getRecordingBook(recordingBook.uid)
      .toPromise()
      .then(x => {
        this.recordingBookSelected = x;
        this.displayRecordingBookEditor = !isEmpty(this.recordingBookSelected);
        this.initTexts();
      })
      .finally(() => this.isLoading = false);
  }


  private createBookEntry(data: any){
    const bookEntryFields: CreateManualBookEntryFields = {
      recordingNo: data.recordingNo,
      instrument: data.instrumentFields as InstrumentFields,
      authorizationDate: data.recordingTime,
      presentationTime: '',
    };

    this.isLoading = true;

    this.data.createBookEntry(this.recordingBookSelected.uid, bookEntryFields)
      .toPromise()
      .then(x => {
        this.recordingBookSelected = x;
        this.resetPanelState();
      })
      .finally(() => {
        this.isLoading = false;
      });
  }


  private deleteBookEntry(bookEntryUID: string){
    this.isLoading = true;

    this.data.deleteBookEntry(this.recordingBookSelected.uid, bookEntryUID)
      .toPromise()
      .then(x => {
        this.recordingBookSelected = x;

        if (bookEntryUID === this.bookEntrySelected.uid) {
          this.sendEvent(RecordingBookEditorEventType.BOOK_ENTRY_SELECTED,
            { bookEntry: EmptyBookEntryShortModel });
        }
      })
      .finally(() => this.isLoading = false);
  }


  private resetPanelState() {
    this.panelAddState = false;
  }


  private sendEvent(eventType: RecordingBookEditorEventType, payload?: any) {
    const event: EventInfo = {
      type: eventType,
      payload
    };

    this.recordingBookEditorEvent.emit(event);
  }
}
