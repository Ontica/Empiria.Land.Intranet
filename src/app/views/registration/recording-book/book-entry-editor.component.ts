/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output } from '@angular/core';
import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';
import { BookEntry, EmptyBookEntry, EmptyInstrumentRecording, InstrumentRecording } from '@app/models';
import { RegistrationStateSelector } from '@app/presentation/exported.presentation.types';
import {
  InstrumentEditorEventType
} from '@app/views/recordable-subjects/instrument/instrument-editor.component';

@Component({
  selector: 'emp-land-book-entry-editor',
  templateUrl: './book-entry-editor.component.html',
})
export class BookEntryEditorComponent implements OnChanges, OnDestroy {

  @Input() bookEntryUID: string;

  @Input() instrumentRecordingUID: string;

  @Output() closeEvent = new EventEmitter<void>();

  helper: SubscriptionHelper;

  cardTitle = 'Inscripción';

  cardHint =
    'Herramienta para buscar, y en su caso generar, folios reales en inscripciones en libros físicos';

  panelAddState = false;

  submitted = false;

  isLoading = false;

  bookEntry: BookEntry = EmptyBookEntry;

  instrumentRecording: InstrumentRecording = EmptyInstrumentRecording;

  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnChanges() {
    this.initLoad();
    this.resetPanelState();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get recordingActs(){
    return this.instrumentRecording.bookRecordingMode ?
      this.bookEntry.recordingActs : this.instrumentRecording.recordingActs;
  }

  initLoad(){
    this.isLoading = true;
    this.helper.select<InstrumentRecording>(RegistrationStateSelector.INSTRUMENT_RECORDING,
      { instrumentRecordingUID: this.instrumentRecordingUID })
      .subscribe(x => {
        this.instrumentRecording = x;
        this.setBookEntry();
        this.initTexts();
        this.isLoading = false;
      });
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

        // this.executeCommand<any>(RegistrationCommandType.UPDATE_BOOK_ENTRY, event.payload)
        //   .then(x => this.resetPanelState());

        console.log('UPDATE_INSTRUMENT', event);

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
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

}
