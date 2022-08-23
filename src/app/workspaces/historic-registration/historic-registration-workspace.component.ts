/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, ViewChild } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { BookEntry, EmptyBookEntry, EmptyRecordingContext, RecordingContext } from '@app/models';

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
  selectedRecordingContext: RecordingContext = EmptyRecordingContext;

  displayBookEntryEdition = false;
  displayFileViewer = false;
  displayRecordingActEditor = false;
  displayRecordableSubjectTabbedView = false;


  onCloseFileViewer() {
    this.unselectCurrentFile();
  }


  onRecordingBookEditionEvent(event: EventInfo) {
    switch (event.type as RecordingBookEditionEventType) {

      case RecordingBookEditionEventType.BOOK_ENTRY_SELECTED:
        Assertion.assertValue(event.payload.bookEntry, 'event.payload.bookEntry');

        this.selectedBookEntry = event.payload.bookEntry;
        this.displayBookEntryEdition = !isEmpty(this.selectedBookEntry);

        this.unselectSecondaryEditors();

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

      case BookEntryEditionEventType.CLOSE_BUTTON_CLICKED:
        this.unselectBookEntry();

        return;

      case BookEntryEditionEventType.RECORDING_ACT_SELECTED:
        Assertion.assertValue(event.payload.instrumentRecordingUID, 'event.payload.instrumentRecordingUID');
        Assertion.assertValue(event.payload.recordingActUID, 'event.payload.recordingActUID');

        this.selectedRecordingContext = event.payload as RecordingContext;
        this.displayRecordingActEditor = this.isRecordingContextValid();

        return;

      case BookEntryEditionEventType.RECORDABLE_SUBJECT_SELECTED:
        Assertion.assertValue(event.payload.instrumentRecordingUID, 'event.payload.instrumentRecordingUID');
        Assertion.assertValue(event.payload.recordingActUID, 'event.payload.recordingActUID');

        this.selectedRecordingContext = event.payload as RecordingContext;
        this.displayRecordableSubjectTabbedView = this.isRecordingContextValid();

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onRecordableSubjectTabbedViewEvent(event: EventInfo) {
    switch (event.type as RecordableSubjectTabbedViewEventType) {

      case RecordableSubjectTabbedViewEventType.CLOSE_BUTTON_CLICKED:
        this.unselectSecondaryEditors();

        return;

      case RecordableSubjectTabbedViewEventType.RECORDABLE_SUBJECT_UPDATED:
        this.refreshSelectedBookEntry();

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onRecordingActEditionEventType(event: EventInfo) {
    switch (event.type as RecordingActEditionEventType) {

      case RecordingActEditionEventType.CLOSE_BUTTON_CLICKED:
        this.unselectSecondaryEditors();

        return;

      case RecordingActEditionEventType.RECORDING_ACT_UPDATED:
        this.refreshSelectedBookEntry();
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private unselectCurrentFile() {
    this.selectedFileViewerData = EmptyFileViewerData;
    this.displayFileViewer = false;
  }


  private unselectBookEntry(){
    this.selectedBookEntry = EmptyBookEntry;
    this.displayBookEntryEdition = false;
  }


  private unselectSecondaryEditors() {
    this.selectedRecordingContext = EmptyRecordingContext;
    this.displayRecordingActEditor = false;
    this.displayRecordableSubjectTabbedView = false;
  }


  private isRecordingContextValid() {
    return !!this.selectedRecordingContext.instrumentRecordingUID &&
           !!this.selectedRecordingContext.recordingActUID;
  }


  private refreshSelectedBookEntry() {
    this.bookEntryEdition.ngOnChanges();
  }

}
