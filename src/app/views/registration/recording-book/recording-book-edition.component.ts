/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { Assertion, EventInfo, Identifiable, isEmpty } from '@app/core';

import { CreateManualBookEntryFields, EmptyRecordingBook,
         RecordingBook, BookEntry, EmptyBookEntry } from '@app/models';

import { BookEntryEditorEventType } from './book-entry-editor.component';

import { BookEntryListEventType } from './book-entry-list.component';

import { RecordingBookSelectorEventType } from './recording-book-selector.component';

import { RecordingDataService } from '@app/data-services';

import { FileViewerData } from '@app/shared/form-controls/file-control/file-control-data';


export enum RecordingBookEditionEventType {
  RECORDING_BOOK_SELECTED = 'RecordingBookEditionComponent.Event.RecordingBookSelected',
  BOOK_ENTRY_SELECTED = 'RecordingBookEditionComponent.Event.BookEntrySelected',
  FILES_SELECTED = 'RecordingBookEditionComponent.Event.FilesSelected',
}

@Component({
  selector: 'emp-land-recording-book-edition',
  templateUrl: './recording-book-edition.component.html',
})
export class RecordingBookEditionComponent implements OnInit {

  @Output() RecordingBookEditionEvent = new EventEmitter<EventInfo>();

  cardHint = 'Seleccione el volumen';

  isLoading = false;

  panelAddState = false;

  submitted = false;

  statusList = [];

  recordingBookSelected: RecordingBook = EmptyRecordingBook;

  displayRecordingBookEdition = false;

  constructor(private data: RecordingDataService ) { }

  ngOnInit(): void {
    this.initTexts();
  }


  onRecordingBookSelectorEvent(event){
    switch (event.type as RecordingBookSelectorEventType) {

      case RecordingBookSelectorEventType.RECORDING_BOOK_CHANGED:

        Assertion.assertValue(event.payload.recordingBook, 'event.payload.recordingBook');

        this.resetPanelState();

        this.loadRecordingBookData(event.payload.recordingBook);

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

        this.sendEvent(RecordingBookEditionEventType.BOOK_ENTRY_SELECTED,
          { bookEntry: event.payload.bookEntry });

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

        this.sendEvent(RecordingBookEditionEventType.FILES_SELECTED, { fileViewerData });

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
        Assertion.assertValue(event.payload.recordingNo, 'event.payload.recordingNo');
        Assertion.assertValue(event.payload.authorizationDate, 'event.payload.authorizationDate');
        Assertion.assertValue(event.payload.presentationTime, 'event.payload.presentationTime');
        Assertion.assertValue(event.payload.instrument, 'event.payload.instrument');

        this.createBookEntry(event.payload as CreateManualBookEntryFields);

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
      this.displayRecordingBookEdition = false;
      this.initTexts();

      return;
    }

    this.setSubmitted(true);

    this.data.getRecordingBook(recordingBook.uid)
      .toPromise()
      .then(x => {
        this.recordingBookSelected = x;
        this.displayRecordingBookEdition = !isEmpty(this.recordingBookSelected);
        this.initTexts();
      })
      .finally(() => this.setSubmitted(false));
  }


  private createBookEntry(bookEntryFields: CreateManualBookEntryFields){

    this.setSubmitted(true);

    this.data.createBookEntry(this.recordingBookSelected.uid, bookEntryFields)
      .toPromise()
      .then(x => {
        this.recordingBookSelected = x;
        this.resetPanelState();
      })
      .finally(() => this.setSubmitted(false));
  }


  private deleteBookEntry(bookEntry: BookEntry){
    this.setSubmitted(true);

    this.data.deleteBookEntry(bookEntry.recordingBookUID, bookEntry.uid)
      .toPromise()
      .then(x => {
        this.recordingBookSelected = x;

        this.sendEvent(RecordingBookEditionEventType.BOOK_ENTRY_SELECTED,
          { bookEntry: EmptyBookEntry });
      })
      .finally(() => this.setSubmitted(false));
  }


  private resetPanelState() {
    this.panelAddState = false;
  }


  private setSubmitted(submitted: boolean) {
    this.isLoading = submitted;
    this.submitted = submitted;
  }


  private sendEvent(eventType: RecordingBookEditionEventType, payload?: any) {
    const event: EventInfo = {
      type: eventType,
      payload
    };

    this.RecordingBookEditionEvent.emit(event);
  }

}
