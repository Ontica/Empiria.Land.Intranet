/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, ViewChild } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { Assertion, EventInfo, SessionService } from '@app/core';

import { BookEntryContext, EmptyBookEntryContext, EmptyRegistryEntryData,
         isRegistryEntryDataValid, RegistryEntryData } from '@app/models';

import { MessageBoxService } from '@app/shared/containers/message-box';

import {
  BookEntryEditionComponent,
  BookEntryEditionEventType
} from '@app/views/registration/recording-book/book-entry-edition.component';

import {
  RegistryEntryEditorEventType
} from '@app/views/registration/registry-entry/registry-entry-editor.component';

@Component({
  selector: 'emp-land-book-entry-main-page',
  templateUrl: './book-entry-main-page.component.html'
})
export class BookEntryMainPageComponent {

  @ViewChild('bookEntryEdition') bookEntryEdition: BookEntryEditionComponent;

  bookEntryContext: BookEntryContext = EmptyBookEntryContext;

  selectedRegistryEntryData: RegistryEntryData = EmptyRegistryEntryData;

  displayRegistryEntryEditor = false;


  constructor(private route: ActivatedRoute,
              private router: Router,
              private session: SessionService,
              private messageBox: MessageBoxService){
    this.validateAndSetBookEntryContextFromRoute();
  }


  onBookEntryEditionEvent(event: EventInfo) {
    switch (event.type as BookEntryEditionEventType) {

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


  private setRegistryEntryData(data: RegistryEntryData) {
    this.selectedRegistryEntryData = data;
    this.displayRegistryEntryEditor = isRegistryEntryDataValid(this.selectedRegistryEntryData);
  }


  private refreshSelectedBookEntry() {
    this.bookEntryEdition.ngOnChanges();
  }

}
