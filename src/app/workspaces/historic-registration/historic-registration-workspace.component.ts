/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, OnDestroy, OnInit } from '@angular/core';

import { Assertion, isEmpty } from '@app/core';

import { BookEntryShortModel, EmptyBookEntryShortModel, EmptyRecordingBook, EmptySelectionAct,
         RecordingBook, SelectionAct } from '@app/models';

import { EmptyFileViewerData,
         FileViewerData } from '@app/shared/form-controls/file-control/file-control-data';
import { BookEntryEditorEventType } from '@app/views/registration/recording-book/book-entry-editor.component';

import {
  RecordingBookEditorEventType
} from '@app/views/registration/recording-book/recording-book-editor.component';


@Component({
  selector: 'emp-land-hsitoric-registration',
  templateUrl: './historic-registration-workspace.component.html'
})
export class HistoricRegistrationWorkspaceComponent implements OnInit, OnDestroy {

  selectedRecordingBook: RecordingBook = EmptyRecordingBook;
  selectedBookEntry: BookEntryShortModel = EmptyBookEntryShortModel;
  selectedFileViewerData: FileViewerData = EmptyFileViewerData;
  selectedRecordingAct: SelectionAct = EmptySelectionAct;

  displayBookEntryEditor = false;
  displayFileViewer = false;
  displayRecordingActEditor = false;

  constructor() {}


  ngOnInit() {}


  ngOnDestroy() {}


  onRecordingBookEditorEvent(event) {
    switch (event.type as RecordingBookEditorEventType) {

      case RecordingBookEditorEventType.RECORDING_BOOK_SELECTED:
        Assertion.assertValue(event.payload.recordingBook, 'event.payload.recordingBook');

        this.selectedRecordingBook = event.payload.recordingBook;
        this.unselectBookEntry();
        this.unselectCurrentFile();
        this.unselectCurrentRecordingAct();

        return;

      case RecordingBookEditorEventType.BOOK_ENTRY_SELECTED:
        Assertion.assertValue(event.payload.bookEntry, 'event.payload.bookEntry');

        this.selectedBookEntry = event.payload.bookEntry;
        this.displayBookEntryEditor = !isEmpty(this.selectedBookEntry);
        this.unselectCurrentRecordingAct();

        return;

      case RecordingBookEditorEventType.FILES_SELECTED:
        Assertion.assertValue(event.payload.fileViewerData, 'event.payload.fileViewerData');

        this.selectedFileViewerData = event.payload.fileViewerData;
        this.displayFileViewer = this.selectedFileViewerData.fileList?.length > 0;

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onBookEntryEditorEvent(event) {
    switch (event.type as BookEntryEditorEventType) {

      case BookEntryEditorEventType.RECORDING_ACT_SELECTED:
        Assertion.assertValue(event.payload.recordingActSelect, 'event.payload.recordingActSelect');

        this.selectedRecordingAct = event.payload.recordingActSelect;
        this.displayRecordingActEditor = !isEmpty(this.selectedRecordingAct.recordingAct);

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onCloseBookEntryEditor() {
    this.unselectBookEntry();
  }


  onCloseFileViewer() {
    this.unselectCurrentFile();
  }


  onCloseRecordingActEditor() {
    this.unselectCurrentRecordingAct();
  }


  private unselectBookEntry(){
    this.selectedBookEntry = EmptyBookEntryShortModel;
    this.displayBookEntryEditor = false;
  }


  private unselectCurrentRecordingAct() {
    this.selectedRecordingAct = EmptySelectionAct;
    this.displayRecordingActEditor = false;
  }


  private unselectCurrentFile() {
    this.selectedFileViewerData = EmptyFileViewerData;
    this.displayFileViewer = false;
  }

}
