/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, ViewChild } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { BookEntry, EmptyBookEntry, EmptyRegistryEntryData, isRegistryEntryDataValid,
         RegistryEntryData } from '@app/models';

import { EmptyFileViewerData,
         FileViewerData } from '@app/shared/form-controls/file-control/file-control-data';

import {
  BookEntryEditionComponent,
  BookEntryEditionEventType
} from '@app/views/registration/recording-book/book-entry-edition.component';

import {
  RecordingBookEditionEventType
} from '@app/views/registration/recording-book/recording-book-edition.component';

import {
  RegistryEntryEditorEventType
} from '@app/views/registration/registry-entry/registry-entry-editor.component';


@Component({
  selector: 'emp-land-historic-registration',
  templateUrl: './historic-registration-workspace.component.html'
})
export class HistoricRegistrationWorkspaceComponent {

  @ViewChild('bookEntryEdition') bookEntryEdition: BookEntryEditionComponent;

  selectedBookEntry: BookEntry = EmptyBookEntry;
  selectedFileViewerData: FileViewerData = EmptyFileViewerData;
  selectedRegistryEntryData: RegistryEntryData = EmptyRegistryEntryData;

  displayBookEntryEdition = false;
  displayFileViewer = false;
  displayRegistryEntryEditor = false;


  onCloseFileViewer() {
    this.setFileViewerData(EmptyFileViewerData);
  }


  onRecordingBookEditionEvent(event: EventInfo) {
    switch (event.type as RecordingBookEditionEventType) {

      case RecordingBookEditionEventType.BOOK_ENTRY_SELECTED:
        Assertion.assertValue(event.payload.bookEntry, 'event.payload.bookEntry');
        this.setSelectedBookEntry(event.payload.bookEntry as BookEntry);
        this.setRegistryEntryData(EmptyRegistryEntryData);
        return;

      case RecordingBookEditionEventType.FILES_SELECTED:
        Assertion.assertValue(event.payload.fileViewerData, 'event.payload.fileViewerData');
        this.setFileViewerData(event.payload.fileViewerData as FileViewerData);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onBookEntryEditionEvent(event: EventInfo) {
    switch (event.type as BookEntryEditionEventType) {

      case BookEntryEditionEventType.CLOSE_BUTTON_CLICKED:
        this.setSelectedBookEntry(EmptyBookEntry);
        return;

      case BookEntryEditionEventType.RECORDING_ACT_SELECTED:
      case BookEntryEditionEventType.RECORDABLE_SUBJECT_SELECTED:
        Assertion.assertValue(event.payload.instrumentRecordingUID, 'event.payload.instrumentRecordingUID');
        Assertion.assertValue(event.payload.recordingActUID, 'event.payload.recordingActUID');
        this.setRegistryEntryData(event.payload as RegistryEntryData);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onRegistryEntryEditorEvent(event: EventInfo) {
    switch (event.type as RegistryEntryEditorEventType) {

      case RegistryEntryEditorEventType.CLOSE_BUTTON_CLICKED:
        this.setRegistryEntryData(EmptyRegistryEntryData);
        return;

      case RegistryEntryEditorEventType.RECORDABLE_SUBJECT_UPDATED:
      case RegistryEntryEditorEventType.RECORDING_ACT_UPDATED:
        this.refreshSelectedBookEntry();
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setSelectedBookEntry(bookEntry: BookEntry) {
    this.selectedBookEntry = bookEntry;
    this.displayBookEntryEdition = !isEmpty(this.selectedBookEntry);
  }


  private setFileViewerData(data: FileViewerData) {
    this.selectedFileViewerData = data;
    this.displayFileViewer = this.selectedFileViewerData.fileList?.length > 0;
  }


  private setRegistryEntryData(data: RegistryEntryData) {
    this.selectedRegistryEntryData = data;
    this.displayRegistryEntryEditor = isRegistryEntryDataValid(this.selectedRegistryEntryData);
  }


  private refreshSelectedBookEntry() {
    this.bookEntryEdition.ngOnChanges();
  }

}
