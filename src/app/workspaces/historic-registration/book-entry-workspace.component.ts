/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, ViewChild } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { Assertion, EventInfo, SessionService } from '@app/core';

import { BookEntryContext, EmptyBookEntryContext, EmptyRecordingContext,
         RecordingContext } from '@app/models';

import { MessageBoxService } from '@app/shared/containers/message-box';

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


@Component({
  selector: 'emp-land-book-entry',
  templateUrl: './book-entry-workspace.component.html'
})
export class BookEntryWorkspaceComponent {

  @ViewChild('bookEntryEdition') bookEntryEdition: BookEntryEditionComponent;

  bookEntryContext: BookEntryContext = EmptyBookEntryContext;

  selectedRecordingContext: RecordingContext = EmptyRecordingContext;

  displayRecordingActEditor = false;

  displayRecordableSubjectTabbedView = false;


  constructor(private route: ActivatedRoute,
              private router: Router,
              private session: SessionService,
              private messageBox: MessageBoxService){
    this.validateAndSetBookEntryContextFromRoute();
  }


  onBookEntryEditionEvent(event: EventInfo) {
    switch (event.type as BookEntryEditionEventType) {

      case BookEntryEditionEventType.RECORDING_ACT_SELECTED:
        Assertion.assertValue(event.payload.instrumentRecordingUID, 'event.payload.instrumentRecordingUID');
        Assertion.assertValue(event.payload.recordingActUID, 'event.payload.recordingActUID');

        this.unselectSecondaryEditors();

        this.selectedRecordingContext = event.payload as RecordingContext;
        this.displayRecordingActEditor = this.isRecordingContextValid();

        return;

      case BookEntryEditionEventType.RECORDABLE_SUBJECT_SELECTED:
        Assertion.assertValue(event.payload.instrumentRecordingUID, 'event.payload.instrumentRecordingUID');
        Assertion.assertValue(event.payload.recordingActUID, 'event.payload.recordingActUID');

        this.unselectSecondaryEditors();

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


  private validateAndSetBookEntryContextFromRoute() {
    this.route.queryParams.subscribe( params => {
      const bookEntryUID = params['uid'] ?? '';
      const recordingBookUID = params['recordingBookUID'] ?? '';
      const instrumentRecordingUID = params['instrumentRecordingUID'] ?? '';

      if (!!bookEntryUID && !!recordingBookUID && !!instrumentRecordingUID) {
        this.bookEntryContext.uid = bookEntryUID;
        this.bookEntryContext.recordingBookUID = recordingBookUID;
        this.bookEntryContext.instrumentRecordingUID = instrumentRecordingUID;
      } else {
        this.messageBox.showError(`La ruta es invalida.`);
        this.router.navigate([this.session.getPrincipal().defaultRoute]);
      }
    });
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
