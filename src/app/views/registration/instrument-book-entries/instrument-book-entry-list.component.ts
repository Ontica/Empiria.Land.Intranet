/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */


import { Component, Input, OnChanges, OnDestroy, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { Command } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';
import { RegistrationCommandType } from '@app/core/presentation/presentation-types';

import { BookEntry, EmptyInstrumentRecording, InstrumentRecording } from '@app/models';
import { MessageBoxService } from '@app/shared/containers/message-box';

import { FilePreviewComponent } from '@app/shared/containers/file-preview/file-preview.component';


@Component({
  selector: 'emp-land-instrument-book-entry-list',
  templateUrl: './instrument-book-entry-list.component.html',
})
export class InstrumentBookEntryListComponent implements OnChanges, OnDestroy {

  @ViewChild('filePreview', { static: true }) filePreview: FilePreviewComponent;

  @Input() instrumentRecording: InstrumentRecording = EmptyInstrumentRecording;

  helper: SubscriptionHelper;

  submitted = false;

  dataSource: MatTableDataSource<BookEntry>;

  private displayedColumnsDefault = ['recordingTime', 'recorderOfficeName', 'recordingSectionName',
                                     'volumeNo', 'recordingNo', 'recordedBy'];

  displayedColumns = [...this.displayedColumnsDefault];


  constructor(private uiLayer: PresentationLayer,
              private messageBox: MessageBoxService) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnChanges() {
    this.dataSource = new MatTableDataSource(this.instrumentRecording.bookEntries);

    this.resetColumns();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  resetColumns() {
    this.displayedColumns = [];

    if (this.instrumentRecording.actions.show.registrationStamps) {
      this.displayedColumns.push('stampMedia');
    }

    this.displayedColumns = [...this.displayedColumns, ...this.displayedColumnsDefault];

    if (this.instrumentRecording.actions.can.deleteRecordingBookEntries) {
      this.displayedColumns.push('action');
    }
  }


  removeBookEntry(bookEntry: BookEntry) {
    if (!this.submitted) {
      const message = this.getConfirmMessage(bookEntry);

      this.messageBox.confirm(message, 'Eliminar registro', 'DeleteCancel')
        .firstValue()
        .then(x => {
          if (x) {
            this.submitted = true;

            const payload = {
              instrumentRecordingUID: this.instrumentRecording.uid,
              bookEntryUID: bookEntry.uid
            };

            this.executeCommand(RegistrationCommandType.DELETE_INSTRUMENT_RECORDING_BOOK_ENTRY, payload)
                .then(() => this.submitted = false);
          }
        });
    }
  }


  printBookEntryStampMedia(bookEntry: BookEntry) {
    this.filePreview.open(bookEntry.stampMedia.url, bookEntry.stampMedia.mediaType);
  }


  private getConfirmMessage(bookEntry: BookEntry): string {
    return `
      <table style="margin: 0;">
        <tr><td>Oficialía: </td><td><strong> ${bookEntry.recorderOfficeName} </strong></td></tr>

        <tr><td>Sección: </td><td><strong> ${bookEntry.recordingSectionName} </strong></td></tr>

        <tr><td>Volumen: </td><td><strong> ${bookEntry.volumeNo} </strong></td></tr>

        <tr><td>Inscripción: </td><td><strong> ${bookEntry.recordingNo} </strong></td></tr>

      </table>

      <br>¿Elimino el registro?`;
  }


  private executeCommand<T>(commandType: RegistrationCommandType, payload?: any): Promise<T> {
    const command: Command = {
      type: commandType,
      payload
    };

    return this.uiLayer.execute<T>(command);
  }

}
