/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { ManualBookEntryFields, EmptyRecordingBook,
         RecordingBook, BookEntry, EmptyBookEntry } from '@app/models';

import { RecordingDataService } from '@app/data-services';

import { FileViewerData } from '@app/shared/form-controls/file-control/file-control-data';

import { sendEvent } from '@app/shared/utils';

import { BookEntryEditorEventType } from './book-entry-editor.component';

import { BookEntryListEventType } from './book-entry-list.component';

import {
  RecordingBookSelectorEventType
} from '@app/views/land-controls/recording-book-selector/recording-book-selector.component';

export enum RecordingBookEditionEventType {
  RECORDING_BOOK_SELECTED = 'RecordingBookEditionComponent.Event.RecordingBookSelected',
  BOOK_ENTRY_SELECTED     = 'RecordingBookEditionComponent.Event.BookEntrySelected',
  FILES_SELECTED          = 'RecordingBookEditionComponent.Event.FilesSelected',
}

@Component({
  selector: 'emp-land-recording-book-edition',
  templateUrl: './recording-book-edition.component.html',
})
export class RecordingBookEditionComponent implements OnInit {

  @Output() recordingBookEditionEvent = new EventEmitter<EventInfo>();

  cardHint = 'Seleccione el volumen';

  isLoading = false;

  panelAddState = false;

  submitted = false;

  statusList = [];

  selectedRecordingBook: RecordingBook = EmptyRecordingBook;

  displayRecordingBookEdition = false;

  constructor(private recordingData: RecordingDataService ) { }

  ngOnInit(): void {
    this.initTexts();
  }


  onRecordingBookSelectorEvent(event){
    switch (event.type as RecordingBookSelectorEventType) {

      case RecordingBookSelectorEventType.RECORDING_BOOK_CHANGED:

        Assertion.assertValue(event.payload.recordingBook, 'event.payload.recordingBook');

        this.setSelectedRecordingBook(EmptyRecordingBook);

        this.loadRecordingBookData(event.payload.recordingBook.uid);

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

        sendEvent(this.recordingBookEditionEvent, RecordingBookEditionEventType.BOOK_ENTRY_SELECTED,
          {bookEntry: event.payload.bookEntry});

        return;

      case BookEntryListEventType.DELETE_BOOK_ENTRY_CLICKED:

        Assertion.assertValue(event.payload.bookEntry, 'event.payload.bookEntry');

        this.deleteBookEntry(event.payload.bookEntry);

        return;

      case BookEntryListEventType.SHOW_FILES_CLICKED:

        Assertion.assertValue(event.payload.bookEntry, 'event.payload.bookEntry');

        const fileViewerData: FileViewerData = {
          fileList: event.payload.bookEntry.mediaFiles,
          title: `Inscripción ${event.payload.bookEntry.recordingNo}, ${this.cardHint}`,
          hint: `<strong>Visor de Archivos</strong>`,
        };

        sendEvent(this.recordingBookEditionEvent, RecordingBookEditionEventType.FILES_SELECTED,
          {fileViewerData});

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onBookEntryEditorEvent(event) {
    if (this.submitted) {
      return;
    }

    switch (event.type as BookEntryEditorEventType) {

      case BookEntryEditorEventType.CREATE_BOOK_ENTRY:
        Assertion.assertValue(event.payload.bookEntry, 'event.payload.bookEntry');
        Assertion.assertValue(event.payload.bookEntry.recordingNo, 'event.payload.bookEntry.recordingNo');
        Assertion.assertValue(event.payload.bookEntry.authorizationDate, 'event.payload.bookEntry.authorizationDate');
        Assertion.assertValue(event.payload.instrument, 'event.payload.instrument');

        this.createBookEntry(event.payload as ManualBookEntryFields);

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private initTexts(){
    if (isEmpty(this.selectedRecordingBook)) {
      this.cardHint = 'Seleccione el volumen';
      return;
    }

    this.cardHint = 'Volumen ' + this.selectedRecordingBook.volumeNo + ', ' +
      this.selectedRecordingBook.recordingSection.name + ', ' +
      this.selectedRecordingBook.recorderOffice.name;
  }


  private setSelectedRecordingBook(recordingBook: RecordingBook) {
    this.selectedRecordingBook = recordingBook;
    this.initTexts();
    this.panelAddState = false;
    this.displayRecordingBookEdition = !isEmpty(this.selectedRecordingBook) &&
      this.selectedRecordingBook.status !== 'Closed';
  }


  private loadRecordingBookData(recordingBookUID: string){
    if (!recordingBookUID) {
      return;
    }

    this.setSubmitted(true);

    this.recordingData.getRecordingBook(recordingBookUID)
      .firstValue()
      .then(x => this.setSelectedRecordingBook(x))
      .finally(() => this.setSubmitted(false));
  }


  private createBookEntry(bookEntryFields: ManualBookEntryFields){
    this.setSubmitted(true);

    this.recordingData.createBookEntry(this.selectedRecordingBook.uid, bookEntryFields)
      .firstValue()
      .then(x => this.setSelectedRecordingBook(x))
      .finally(() => this.setSubmitted(false));
  }


  private deleteBookEntry(bookEntry: BookEntry){
    this.setSubmitted(true);

    this.recordingData.deleteBookEntry(bookEntry.recordingBookUID, bookEntry.uid)
      .firstValue()
      .then(x => {
        this.selectedRecordingBook = x;

        sendEvent(this.recordingBookEditionEvent, RecordingBookEditionEventType.BOOK_ENTRY_SELECTED,
          {bookEntry: EmptyBookEntry});
      })
      .finally(() => this.setSubmitted(false));
  }


  private setSubmitted(submitted: boolean) {
    this.isLoading = submitted;
    this.submitted = submitted;
  }

}
