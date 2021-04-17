/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { RecordingDataService } from '@app/data-services';

import { BookEntry, EmptyBookEntry, EmptyInstrumentRecording, InstrumentRecording,
         RecordingActTypeGroup, RegistrationCommand} from '@app/models';

import {
  InstrumentEditorEventType
} from '@app/views/recordable-subjects/instrument/instrument-editor.component';

import { RecordingActCreatorEventType } from '../recording-acts/recording-act-creator.component';

import { RecordingActsListEventType } from '../recording-acts/recording-acts-list.component';

@Component({
  selector: 'emp-land-book-entry-editor',
  templateUrl: './book-entry-editor.component.html',
})
export class BookEntryEditorComponent implements OnChanges {

  @Input() recordingBookUID: string;

  @Input() bookEntryUID: string;

  @Input() instrumentRecordingUID: string;

  @Output() closeEvent = new EventEmitter<void>();

  cardTitle = 'Inscripción';

  cardHint =
    'Herramienta para buscar, y en su caso generar, folios reales en inscripciones en libros físicos';

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
    this.closeEvent.emit();
  }


  onInstrumentEditorEvent(event) {
    if (this.submitted) {
      return;
    }

    switch (event.type as InstrumentEditorEventType) {

      case InstrumentEditorEventType.UPDATE_INSTRUMENT:

        console.log('UPDATE_INSTRUMENT', event);

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
      case RecordingActsListEventType.SELECT_RECORDING_ACT:
        console.log('SELECT_RECORDING_ACT', event);

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


  private getRecordingActTypesForBookEntry(){
    this.recordingData.getRecordingActTypesForBookEntry(this.recordingBookUID, this.bookEntryUID)
      .subscribe(x => {
        this.recordingActTypeGroupList = x;
      });
  }


  private appendRecordingActToBookEntry(registrationCommand: RegistrationCommand) {
    this.setSubmited(true);

    this.recordingData
      .appendRecordingActToBookEntry(this.recordingBookUID, this.bookEntryUID, registrationCommand)
      .toPromise()
      .then(x => {
        this.setInstrumentRecording(x);
      })
      .finally(() => {
        this.setSubmited(false);
      });
  }


  private removeRecordingActFromBookEntry(recordingActUID: string) {
    this.setSubmited(true);

    this.recordingData
      .removeRecordingActFromBookEntry(this.recordingBookUID, this.bookEntryUID, recordingActUID)
      .toPromise()
      .then(x => {
        this.setInstrumentRecording(x);
      })
      .finally(() => {
        this.setSubmited(false);
      });
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
  }


  private resetPanelState() {
    this.panelAddState = false;
  }


  private setSubmited(submitted: boolean) {
    this.isLoading = submitted;
    this.submitted = submitted;
  }

}
