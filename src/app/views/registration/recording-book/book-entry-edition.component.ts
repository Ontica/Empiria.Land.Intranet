/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { RecordingDataService } from '@app/data-services';

import { BookEntry, ManualBookEntryFields, EmptyBookEntry, EmptyInstrumentRecording,
         InstrumentRecording, RecordingActTypeGroup, RegistrationCommand} from '@app/models';

import { sendEvent } from '@app/shared/utils';

import { RecordingActCreatorEventType } from '../recording-acts/recording-act-creator.component';

import { RecordingActsListEventType } from '../recording-acts/recording-acts-list.component';

import { BookEntryEditorEventType } from './book-entry-editor.component';

export enum BookEntryEditionEventType {
  CLOSE_BUTTON_CLICKED        = 'BookEntryEditionComponent.Event.CloseButtonClicked',
  RECORDABLE_SUBJECT_SELECTED = 'BookEntryEditionComponent.Event.RecordableSubjectSelected',
  RECORDING_ACT_SELECTED      = 'BookEntryEditionComponent.Event.RecordingActSelected',
}


@Component({
  selector: 'emp-land-book-entry-edition',
  templateUrl: './book-entry-edition.component.html',
})
export class BookEntryEditionComponent implements OnChanges {

  @Input() recordingBookUID: string;

  @Input() bookEntryUID: string;

  @Input() instrumentRecordingUID: string;

  @Output() bookEntryEditionEvent = new EventEmitter<EventInfo>();

  cardTitle = 'Inscripción';

  cardHint =
    'Herramienta para buscar, y en su caso generar, folios reales en inscripciones en libros físicos';

  recordingActListTitle = 'Predios y actos jurídicos registrados en esta inscripción';

  panelAddState = false;

  submitted = false;

  isLoading = false;

  bookEntry: BookEntry = EmptyBookEntry;

  instrumentRecording: InstrumentRecording = EmptyInstrumentRecording;

  recordingActTypeGroupList: RecordingActTypeGroup[] = [];

  constructor(private recordingData: RecordingDataService) {
  }


  ngOnChanges() {
    this.getInstrumentRecording();
  }


  get recordingActs(){
    return this.instrumentRecording.bookRecordingMode ?
      this.bookEntry.recordingActs : this.instrumentRecording.recordingActs;
  }


  onClose() {
    sendEvent(this.bookEntryEditionEvent, BookEntryEditionEventType.CLOSE_BUTTON_CLICKED);
  }


  onBookEntryEditorEvent(event) {
    if (this.submitted) {
      return;
    }

    switch (event.type as BookEntryEditorEventType) {

      case BookEntryEditorEventType.UPDATE_BOOK_ENTRY:
        Assertion.assertValue(event.payload.bookEntry, 'event.payload.bookEntry');
        Assertion.assertValue(event.payload.bookEntry.recordingNo, 'event.payload.bookEntry.recordingNo');
        Assertion.assertValue(event.payload.bookEntry.authorizationDate, 'event.payload.bookEntry.authorizationDate');
        Assertion.assertValue(event.payload.instrument, 'event.payload.instrument');

        this.updateBookEntryInstrumentRecording(event.payload as ManualBookEntryFields);

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onRecordingActCreatorEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type as RecordingActCreatorEventType) {
      case RecordingActCreatorEventType.APPEND_RECORDING_ACT:
        Assertion.assertValue(event.payload.instrumentRecordingUID, 'event.payload.instrumentRecordingUID');
        Assertion.assertValue(event.payload.registrationCommand, 'event.payload.registrationCommand');
        this.appendRecordingActToBookEntry(event.payload.registrationCommand as RegistrationCommand);
        return;

      default:
        throw Assertion.assertNoReachThisCode(`Unrecoginzed event ${event.type}.`);
    }
  }


  onRecordingActsListEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type as RecordingActsListEventType) {
      case RecordingActsListEventType.SELECT_RECORDABLE_SUBJECT:
        sendEvent(this.bookEntryEditionEvent, BookEntryEditionEventType.RECORDABLE_SUBJECT_SELECTED,
          event.payload);

        return;

      case RecordingActsListEventType.SELECT_RECORDING_ACT:
        sendEvent(this.bookEntryEditionEvent, BookEntryEditionEventType.RECORDING_ACT_SELECTED,
          event.payload);

        return;

      case RecordingActsListEventType.REMOVE_RECORDING_ACT:
        Assertion.assertValue(event.payload.recordingActUID, 'event.payload.recordingActUID');
        this.removeRecordingActFromBookEntry(event.payload.recordingActUID);
        return;

      default:
        throw Assertion.assertNoReachThisCode(`Unrecoginzed event ${event.type}.`);
    }
  }


  private getInstrumentRecording(){
    this.isLoading = true;
    this.recordingData.getInstrumentRecording(this.instrumentRecordingUID)
      .subscribe(x => {
        this.setInstrumentRecording(x);
        this.initTexts();
        this.getRecordingActTypesForBookEntry();
      })
      .add(() => this.isLoading = false);
  }


  private updateBookEntryInstrumentRecording(bookEntryFields: ManualBookEntryFields) {

    this.setSubmited(true);

    this.recordingData
      .updateBookEntryInstrumentRecording(this.instrumentRecording.uid, this.bookEntryUID, bookEntryFields)
      .toPromise()
      .then(x => this.setInstrumentRecording(x))
      .finally(() => this.setSubmited(false));
  }


  private getRecordingActTypesForBookEntry(){
    this.recordingData.getRecordingActTypesForBookEntry(this.recordingBookUID, this.bookEntryUID)
      .subscribe(x => this.recordingActTypeGroupList = x);
  }


  private appendRecordingActToBookEntry(registrationCommand: RegistrationCommand) {
    this.setSubmited(true);

    this.recordingData
      .appendRecordingActToBookEntry(this.recordingBookUID, this.bookEntryUID, registrationCommand)
      .toPromise()
      .then(x => this.setInstrumentRecording(x))
      .finally(() => this.setSubmited(false));
  }


  private removeRecordingActFromBookEntry(recordingActUID: string) {
    this.setSubmited(true);

    this.recordingData
      .removeRecordingActFromBookEntry(this.recordingBookUID, this.bookEntryUID, recordingActUID)
      .toPromise()
      .then(x => this.setInstrumentRecording(x))
      .finally(() => this.setSubmited(false));
  }


  private setInstrumentRecording(instrumentRecording: InstrumentRecording){
    this.instrumentRecording = instrumentRecording;
    this.setBookEntry();
    this.resetPanelState();
  }


  private setBookEntry(){
    this.bookEntry = EmptyBookEntry;
    if (this.instrumentRecording.bookEntries.filter(x => x.uid === this.bookEntryUID).length > 0) {
      this.bookEntry = this.instrumentRecording.bookEntries.filter(x => x.uid === this.bookEntryUID)[0];
    }
  }


  private initTexts(){
    this.cardTitle = `Inscripción ${this.bookEntry?.recordingNo},
      Volumen ${this.bookEntry?.volumeNo},
      ${this.bookEntry?.recordingSectionName},
      ${this.bookEntry?.recorderOfficeName}`;

    this.cardHint = `<strong>Estado: ${this.bookEntry?.status} </strong><br>
      Herramienta para buscar, y en su caso generar, folios reales en inscripciones en libros físicos`;

    this.recordingActListTitle = `Predios y actos registrados en la <strong>${this.cardTitle}</strong>`;
  }


  private resetPanelState() {
    this.panelAddState = false;
  }


  private setSubmited(submitted: boolean) {
    this.isLoading = submitted;
    this.submitted = submitted;
  }

}
