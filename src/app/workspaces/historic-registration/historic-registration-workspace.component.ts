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
        this.unselectCurrentRecordingAct();

        return;

      case RecordingBookEditorEventType.BOOK_ENTRY_SELECTED:
        Assertion.assertValue(event.payload.bookEntry, 'event.payload.bookEntry');

        this.selectedBookEntry = event.payload.bookEntry;
        this.displayBookEntryEditor = !isEmpty(this.selectedBookEntry);
        this.unselectCurrentRecordingAct();

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }

  unselectBookEntry(){
    this.selectedBookEntry = EmptyBookEntryShortModel;
    this.displayBookEntryEditor = false;
  }


  unselectCurrentRecordingAct() {
    this.selectedRecordingAct = EmptySelectionAct;
    this.displayRecordingActEditor = false;
  }

}
