/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { DateStringLibrary, EventInfo } from '@app/core';

import { MessageBoxService } from '@app/shared/services';

import { sendEvent } from '@app/shared/utils';

import { BookEntry, EmptyBookEntry, EmptyRecordingBook, RecordingBook } from '@app/models';


export enum BookEntryListEventType {
  BOOK_ENTRY_CLICKED = 'BookEntryListComponent.Event.BookEntryClicked',
  DELETE_BOOK_ENTRY_CLICKED = 'BookEntryListComponent.Event.DeleteBookEntryClicked',
  SHOW_FILES_CLICKED = 'BookEntryListComponent.Event.ShowFilesClicked',
}

@Component({
  selector: 'emp-land-book-entry-list',
  templateUrl: './book-entry-list.component.html',
})
export class BookEntryListComponent implements OnChanges {

  @Input() recordingBook: RecordingBook = EmptyRecordingBook;

  @Input() bookEntrySelected: BookEntry = EmptyBookEntry;

  @Output() bookEntryListEvent = new EventEmitter<EventInfo>();

  dataSource: MatTableDataSource<BookEntry>;

  displayedColumns = ['recordingNo', 'instrumentName', 'recordingTime', 'status',
                      'actionShowFiles', 'actionEdit', 'actionDelete'];


  constructor(private messageBox: MessageBoxService) {}


  ngOnChanges(changes: SimpleChanges) {
    if (changes.recordingBook) {
      this.dataSource = new MatTableDataSource(this.recordingBook.bookEntries);
    }
  }


  onBookEntryClicked(bookEntry: BookEntry){
    if (bookEntry) {
      this.bookEntrySelected = bookEntry;
      sendEvent(this.bookEntryListEvent, BookEntryListEventType.BOOK_ENTRY_CLICKED, {bookEntry});
    }
  }


  removeBookEntry(bookEntry: BookEntry) {
    const message = this.getConfirmMessage(bookEntry);

    this.messageBox.confirm(message, 'Eliminar registro', 'DeleteCancel')
      .firstValue()
      .then(x => {
        if (x) {
          sendEvent(this.bookEntryListEvent, BookEntryListEventType.DELETE_BOOK_ENTRY_CLICKED, {bookEntry});
        }
      });
  }


  showFilesBookEntry(bookEntry: BookEntry) {
    sendEvent(this.bookEntryListEvent, BookEntryListEventType.SHOW_FILES_CLICKED, {bookEntry});
  }


  private getConfirmMessage(bookEntry: BookEntry): string {
    return `
      <table style="margin: 0;">
        <tr><td>Inscripción: </td><td><strong> ${bookEntry.recordingNo ?? '-'} </strong></td></tr>

        <tr><td>Instrumento: </td><td><strong> ${bookEntry.instrumentRecording.asText ?? '-'} </strong></td></tr>

        <tr><td class="nowrap">Fecha de registro: </td><td>
          <strong> ${DateStringLibrary.format(bookEntry.recordingTime) ?? '-'} </strong>
        </td></tr>

      </table>

     <br>¿Elimino el registro?`;
  }

}
