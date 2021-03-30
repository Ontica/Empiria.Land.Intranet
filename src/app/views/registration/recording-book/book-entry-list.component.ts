import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DateStringLibrary, EventInfo } from '@app/core';
import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';
import { EmptyRecordingBook, RecordingBook, RecordingBookEntry } from '@app/models';
import { MessageBoxService } from '@app/shared/containers/message-box';

export enum BookEntryListEventType {
  BOOK_ENTRY_CLICKED = 'BookEntryListComponent.Event.BookEntryClicked',
  DELETE_BOOK_ENTRY_CLICKED = 'BookEntryListComponent.Event.DeleteBookEntryClicked',
}

@Component({
  selector: 'emp-land-book-entry-list',
  templateUrl: './book-entry-list.component.html',
  styles: [
  ]
})
export class BookEntryListComponent implements OnChanges {

  @Input() recordingBook: RecordingBook = EmptyRecordingBook;

  @Output() bookEntryListEvent = new EventEmitter<EventInfo>();

  helper: SubscriptionHelper;

  dataSource: MatTableDataSource<RecordingBookEntry>;

  displayedColumns = ['bookEntry', 'instrument', 'recordingTime', 'status', 'action'];

  constructor(private uiLayer: PresentationLayer,
              private messageBox: MessageBoxService) {
    this.helper = uiLayer.createSubscriptionHelper();
  }

  ngOnChanges() {
    this.dataSource = new MatTableDataSource(this.recordingBook.BookEntryList);
  }


  onBookEntryClicked(bookEntry: RecordingBookEntry){
    if (bookEntry) {
      this.sendEvent(BookEntryListEventType.BOOK_ENTRY_CLICKED,
                    { bookEntry });
    }
  }


  removeBookEntry(bookEntry: RecordingBookEntry) {
    // if (bookEntry.canEdit) {
    const message = this.getConfirmMessage(bookEntry);

    this.messageBox.confirm(message, 'Eliminar registro', 'DeleteCancel')
      .toPromise()
      .then(x => {
        if (x) {

          const payload = {
            recorderBookUID: this.recordingBook.uid,
            bookEntryUID: bookEntry.uid
          };

          this.sendEvent(BookEntryListEventType.DELETE_BOOK_ENTRY_CLICKED,
                        { bookEntry: payload });
        }
      });
    // }
  }


  private getConfirmMessage(bookEntry: RecordingBookEntry): string {
    return `
      <table style="margin: 0;">
        <tr><td>Inscripción: </td><td><strong> ${bookEntry.name ?? '-'} </strong></td></tr>

        <tr><td>Instrumento: </td><td><strong> ${bookEntry.instrument ?? '-'} </strong></td></tr>

        <tr><td class="nowrap">Fecha de registro: </td><td>
          <strong> ${DateStringLibrary.format(bookEntry.recordingTime) ?? '-'} </strong>
        </td></tr>

      </table>

     <br>¿Elimino el registro?`;
  }



  private sendEvent(eventType: BookEntryListEventType, payload?: any) {
    const event: EventInfo = {
      type: eventType,
      payload
    };

    this.bookEntryListEvent.emit(event);
  }

}
