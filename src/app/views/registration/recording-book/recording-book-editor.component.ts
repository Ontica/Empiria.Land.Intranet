/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Command } from '@app/core';
import { PresentationLayer } from '@app/core/presentation';
import { BookEntryShortModel, RecordingBook } from '@app/models';
import { RegistrationAction, RegistrationCommandType } from '@app/presentation/exported.presentation.types';
import { BookEntryListEventType } from './book-entry-list.component';
import {
  InstrumentEditorEventType
} from '@app/views/recordable-subjects/instrument/instrument-editor.component';


@Component({
  selector: 'emp-land-recording-book-editor',
  templateUrl: './recording-book-editor.component.html',
})
export class RecordingBookEditorComponent implements OnInit, OnChanges {

  @Input() recordingBook: RecordingBook;

  @Output() closeEvent = new EventEmitter<void>();

  cardTitle = 'Volumen';

  cardHint: string;

  panelAddState = false;

  submitted = false;

  statusList = [];

  constructor(private uiLayer: PresentationLayer) { }

  ngOnInit(): void {
  }

  ngOnChanges() {
    console.log('Recording Book Editor: ', this.recordingBook);
    this.initTexts();
    this.resetPanelState();
  }

  onClose() {
    this.closeEvent.emit();
  }

  onBookEntryListEvent(event) {
    if (this.submitted) {
      return;
    }

    switch (event.type as BookEntryListEventType) {

      case BookEntryListEventType.BOOK_ENTRY_CLICKED:

        const bookEntry: BookEntryShortModel = {
          uid: event.payload.bookEntry.uid,
          recordingNo: event.payload.bookEntry.recordingNo,
          instrumentRecordingUID: event.payload.bookEntry.instrumentRecording.uid,
        };

        this.uiLayer.dispatch(RegistrationAction.SELECT_BOOK_ENTRY, { bookEntry } );

        return;

      case BookEntryListEventType.DELETE_BOOK_ENTRY_CLICKED:

        // this.executeCommand<any>(RegistrationCommandType.DELETE_RECORDING_BOOK_ENTRY, event.payload);

        console.log('DELETE_RECORDING_BOOK_ENTRY', event);

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }

  onInstrumentEditorEvent(event) {
    if (this.submitted) {
      return;
    }

    switch (event.type as InstrumentEditorEventType) {

      case InstrumentEditorEventType.CREATE_INSTRUMENT:

        // this.executeCommand<any>(RegistrationCommandType.ADD_RECORDING_BOOK, event.payload)
        //   .then(x => this.resetPanelState());

        console.log('CREATE_INSTRUMENT', event);

        this.resetPanelState();

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }

  private initTexts(){
    this.cardTitle = `Volumen ${this.recordingBook.volumeNo},
     ${this.recordingBook.recordingSection.name}, ${this.recordingBook.recorderOffice.name}`;
  }

  private resetPanelState() {
    this.panelAddState = false;
  }


  private executeCommand<T>(commandType: RegistrationCommandType, payload?: any): Promise<T> {
    this.submitted = true;

    const command: Command = {
      type: commandType,
      payload
    };

    return this.uiLayer.execute<T>(command)
      .finally(() => this.submitted = false);
  }

}
