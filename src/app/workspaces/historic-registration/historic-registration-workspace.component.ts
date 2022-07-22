/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, ViewChild } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { BookEntry, EmptyBookEntry, EmptySelectionAct, InstrumentRecording, SelectionAct } from '@app/models';

import { EmptyFileViewerData,
         FileViewerData } from '@app/shared/form-controls/file-control/file-control-data';

import {
  RecordableSubjectTabbedViewEventType
} from '@app/views/registration/recordable-subject/recordable-subject-tabbed-view.component';

import {
  RecordingActEditionEventType
} from '@app/views/registration/recording-acts/recording-act-edition.component';

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
  displayRecordableSubjectTabbedView = false;


  onRecordingBookEditionEvent(event: EventInfo) {
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


  onBookEntryEditionEvent(event: EventInfo) {
    switch (event.type as BookEntryEditionEventType) {

      case BookEntryEditionEventType.RECORDING_ACT_SELECTED:
        Assertion.assertValue(event.payload.recordingActSelect, 'event.payload.recordingActSelect');

        this.selectedRecordingAct = event.payload.recordingActSelect;
        this.displayRecordingActEditor = !isEmpty(this.selectedRecordingAct.recordingAct);

        return;

      case BookEntryEditionEventType.RECORDABLE_SUBJECT_SELECTED:
        Assertion.assertValue(event.payload.recordingActSelect, 'event.payload.recordingActSelect');

        this.selectedRecordingAct = event.payload.recordingActSelect;
        this.displayRecordableSubjectTabbedView = !isEmpty(this.selectedRecordingAct.recordingAct);

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onRecordableSubjectTabbedViewEvent(event: EventInfo) {
    switch (event.type as RecordableSubjectTabbedViewEventType) {

      case RecordableSubjectTabbedViewEventType.CLOSE_BUTTON_CLICKED:
        this.unselectCurrentRecordingAct();

        return;

      case RecordableSubjectTabbedViewEventType.RECORDABLE_SUBJECT_UPDATED:
        Assertion.assertValue(event.payload.instrumentRecording, 'event.payload.instrumentRecording');

        this.refreshInstrumentRecordingAndSelectionAct(
          event.payload.instrumentRecording as InstrumentRecording);

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onRecordingActEditionEventType(event: EventInfo) {
    switch (event.type as RecordingActEditionEventType) {

      case RecordingActEditionEventType.CLOSE_BUTTON_CLICKED:
        this.unselectCurrentRecordingAct();

        return;

      case RecordingActEditionEventType.RECORDING_ACT_UPDATED:
        this.refreshBookEntrySelected();
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
    this.displayRecordableSubjectTabbedView = false;
  }


  unselectCurrentFile() {
    this.selectedFileViewerData = EmptyFileViewerData;
    this.displayFileViewer = false;
  }


  private refreshInstrumentRecordingAndSelectionAct(instrumentRecording: InstrumentRecording) {
    const recordingAct = instrumentRecording.recordingActs
      .find(x => x.uid === this.selectedRecordingAct.recordingAct.uid);

    if (!isEmpty(recordingAct)) {
      const selectionAct: SelectionAct = {
        instrumentRecording,
        recordingAct: recordingAct,
      };

      this.selectedRecordingAct = selectionAct;
    } else {
      this.unselectCurrentRecordingAct();
    }

    this.refreshBookEntrySelected();
  }


  private refreshBookEntrySelected() {
    this.bookEntryEdition.ngOnChanges();
  }

}
