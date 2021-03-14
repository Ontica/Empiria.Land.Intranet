/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */


import { Component, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { Command } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';
import { InstrumentsCommandType } from '@app/core/presentation/presentation-types';

import { BookEntry } from '@app/models';
import { MessageBoxService } from '@app/shared/containers/message-box';

import {
  FilePrintPreviewComponent
} from '@app/shared/form-controls/file-print-preview/file-print-preview.component';


@Component({
  selector: 'emp-land-book-entries-list',
  templateUrl: './book-entries-list.component.html',
})
export class BookEntriesListComponent implements OnChanges, OnDestroy {

  @ViewChild('filePrintPreview', { static: true }) filePrintPreview: FilePrintPreviewComponent;

  @Input() transactionUID: string;

  @Input() instrumentUID: string;

  @Input() bookEntries: BookEntry[] = [];

  @Input() showRegistrationStamps = false;

  @Input() canDelete = false;

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


  ngOnChanges(changes: SimpleChanges) {
    if (changes.bookEntries) {
      this.dataSource = new MatTableDataSource(this.bookEntries);
    }

    this.resetColumns();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  resetColumns() {
    this.displayedColumns = [];

    if (this.showRegistrationStamps) {
      this.displayedColumns.push('stampMedia');
    }

    this.displayedColumns = [...this.displayedColumns, ...this.displayedColumnsDefault];

    if (this.canDelete) {
      this.displayedColumns.push('action');
    }
  }


  removeBookEntry(recording: BookEntry) {
    if (!this.submitted) {
      const message = this.getConfirmMessage(recording);

      this.messageBox.confirm(message, 'Eliminar registro', 'DeleteCancel')
        .toPromise()
        .then(x => {
          if (x) {
            this.submitted = true;

            const payload = {
              transactionUID: this.transactionUID,
              instrumentUID: this.instrumentUID,
              physicalRecordingUID: recording.uid
            };

            this.executeCommand(InstrumentsCommandType.DELETE_PHYSICAL_RECORDING, payload)
              .then(() => this.submitted = false);
          }
        });
    }
  }


  printBookEntryStampMedia(bookEntry: BookEntry) {
    this.filePrintPreview.open(bookEntry.stampMedia.url, bookEntry.stampMedia.mediaType);
  }


  private getConfirmMessage(bookEntry: BookEntry): string {
    return `
      <table style="margin: 0;">
        <tr><td>Distrito: </td><td><strong> ${bookEntry.recorderOfficeName} </strong></td></tr>

        <tr><td>Sección: </td><td><strong> ${bookEntry.recordingSectionName} </strong></td></tr>

        <tr><td>Volumen: </td><td><strong> ${bookEntry.volumeNo} </strong></td></tr>

        <tr><td>Inscripción: </td><td><strong> ${bookEntry.recordingNo} </strong></td></tr>

      </table>

      <br>¿Elimino el registro?`;
  }


  private executeCommand<T>(commandType: InstrumentsCommandType, payload?: any): Promise<T> {
    const command: Command = {
      type: commandType,
      payload
    };

    return this.uiLayer.execute<T>(command);
  }

}
