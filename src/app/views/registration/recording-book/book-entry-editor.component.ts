/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { BookEntry, EmptyInstrumentRecording, InstrumentRecording, RecordingBook } from '@app/models';
import { InstrumentEditorEventType } from '@app/views/recordable-subjects/instrument/instrument-editor.component';

@Component({
  selector: 'emp-land-book-entry-editor',
  templateUrl: './book-entry-editor.component.html',
})
export class BookEntryEditorComponent implements OnChanges, OnInit {

  @Input() bookEntry: BookEntry;

  @Output() closeEvent = new EventEmitter<void>();

  recordingBook: RecordingBook;

  cardTitle = 'Inscripción';

  cardHint =
    'Herramienta para buscar, y en su caso generar, folios reales en inscripciones en libros físicos';

  panelAddState = false;

  submitted = false;

  instrumentRecording: InstrumentRecording = EmptyInstrumentRecording;

  constructor() { }


  ngOnChanges() {
    console.log('Book Entry Editor: ', this.bookEntry);
    this.initTexts();
    this.resetPanelState();
  }


  ngOnInit(): void {
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
