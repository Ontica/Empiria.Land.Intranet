/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, ViewChild } from '@angular/core';

import { Assertion, isEmpty } from '@app/core';

import { BookEntry, EmptyBookEntry, EmptySelectionAct, InstrumentRecording, SelectionAct } from '@app/models';

import { EmptyFileViewerData,
         FileViewerData } from '@app/shared/form-controls/file-control/file-control-data';

import {
  RecordableSubjectTabbedViewEventType
} from '@app/views/registration/recordable-subject-tabbed-view/recordable-subject-tabbed-view.component';

import {
  BookEntryEditionComponent,
  BookEntryEditionEventType
} from '@app/views/registration/recording-book/book-entry-edition.component';

import {
  RecordingBookEditionEventType
} from '@app/views/registration/recording-book/recording-book-edition.component';


@Component({
  selector: 'emp-land-hsitoric-registration',
  templateUrl: './historic-registration-workspace.component.html'
})
export class HistoricRegistrationWorkspaceComponent {

  @ViewChild('bookEntryEdition') bookEntryEdition: BookEntryEditionComponent;

  selectedBookEntry: BookEntry = EmptyBookEntry;
  selectedFileViewerData: FileViewerData = EmptyFileViewerData;
  selectedRecordingAct: SelectionAct = EmptySelectionAct;

  displayBookEntryEdition = false;
  displayFileViewer = false;
  displayRecordingActEditor = false;

  constructor() {}


  onRecordingBookEditionEvent(event) {
    switch (event.type as RecordingBookEditionEventType) {

      case RecordingBookEditionEventType.BOOK_ENTRY_SELECTED:
        Assertion.assertValue(event.payload.bookEntry, 'event.payload.bookEntry');

        this.selectedBookEntry = event.payload.bookEntry;
        this.displayBookEntryEdition = !isEmpty(this.selectedBookEntry);

        this.unselectCurrentRecordingAct();

        return;

      case RecordingBookEditionEventType.FILES_SELECTED:
        Assertion.assertValue(event.payload.fileViewerData, 'event.payload.fileViewerData');

        this.selectedFileViewerData = event.payload.fileViewerData;
        this.displayFileViewer = this.selectedFileViewerData.fileList?.length > 0;

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onBookEntryEditionEvent(event) {
    switch (event.type as BookEntryEditionEventType) {

      case BookEntryEditionEventType.RECORDING_ACT_SELECTED:
        Assertion.assertValue(event.payload.recordingActSelect, 'event.payload.recordingActSelect');

        this.selectedRecordingAct = event.payload.recordingActSelect;
        this.displayRecordingActEditor = !isEmpty(this.selectedRecordingAct.recordingAct);

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onRecordableSubjectTabbedViewEvent(event) {
    switch (event.type as RecordableSubjectTabbedViewEventType) {

      case RecordableSubjectTabbedViewEventType.UPDATED_RECORDABLE_SUBJECT:
        Assertion.assertValue(event.payload.instrumentRecording, 'event.payload.instrumentRecording');

        this.refreshInstrumentRecordingAndSelectionAct(
          event.payload.instrumentRecording as InstrumentRecording);

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  unselectBookEntry(){
    this.selectedBookEntry = EmptyBookEntry;
    this.displayBookEntryEdition = false;
  }


  unselectCurrentRecordingAct() {
    this.selectedRecordingAct = EmptySelectionAct;
    this.displayRecordingActEditor = false;
  }


  unselectCurrentFile() {
    this.selectedFileViewerData = EmptyFileViewerData;
    this.displayFileViewer = false;
  }


  private refreshInstrumentRecordingAndSelectionAct(instrumentRecording: InstrumentRecording) {
    const recordingAct = instrumentRecording.recordingActs
      .filter(x => x.uid === this.selectedRecordingAct.recordingAct.uid);

    if (recordingAct.length > 0) {
      const selectionAct: SelectionAct = {
        instrumentRecording,
        recordingAct: recordingAct[0]
      };

      this.selectedRecordingAct = selectionAct;
    } else {
        this.unselectCurrentRecordingAct();
    }

    this.bookEntryEdition.ngOnChanges();
  }

}
