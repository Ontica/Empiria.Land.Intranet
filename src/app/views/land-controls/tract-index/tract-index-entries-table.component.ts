/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';

import { EventInfo, isEmpty } from '@app/core';

import { TractIndexEntry} from '@app/models';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { sendEvent } from '@app/shared/utils';

export enum TractIndexEntriesTableEventType {
  TRACT_INDEX_ENTRY_CLICKED    = 'TractIndexEntriesTableComponent.Event.TractIndexEntryClicked',
  RECORDING_ACT_CLICKED        = 'TractIndexEntriesTableComponent.Event.RecordingActClicked',
  BOOK_ENTRY_CLICKED           = 'TractIndexEntriesTableComponent.Event.BookEntryClicked',
  REMOVE_RECORDING_ACT_CLICKED = 'TractIndexEntriesTableComponent.Event.RemoveRecordingActClicked',
}

interface TractIndexEntryDataTable extends TractIndexEntry {
  number?: string;
  isChild?: boolean;
}

@Component({
  selector: 'emp-land-tract-index-entries-table',
  templateUrl: './tract-index-entries-table.component.html',
})
export class TractIndexEntriesTableComponent implements OnChanges  {

  @Input() tractIndexEntriesList: TractIndexEntry[] = [];

  @Input() filter: any = null;

  @Input() tractIndexEntryUID = '';

  @Input() rowClickeable = false;

  @Input() canDelete = false;

  @Input() hasNestedEntries = false;

  @Input() checkNestedEntries = false;

  @Output() tractIndexEntriesTableEvent = new EventEmitter<EventInfo>();

  private displayedColumnsDefault = ['rowIndex', 'issuedAndRequestedTime', 'recordingAct', 'subjectChanges',
                                     'recordLink'];

  displayedColumns = [...this.displayedColumnsDefault];

  dataSource: MatTableDataSource<TractIndexEntryDataTable>;


  constructor(private messageBox: MessageBoxService) {

  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.tractIndexEntriesList) {
      this.setDataSource();
    }

    if (changes.checkNestedEntries) {
      this.buildDataSource();
    }

    if (changes.filter) {
      this.applyFilter();
    }
  }


  onTractIndexEntryClicked(tractIndexEntry: TractIndexEntry) {
    if(this.rowClickeable) {
      sendEvent(this.tractIndexEntriesTableEvent,
        TractIndexEntriesTableEventType.TRACT_INDEX_ENTRY_CLICKED, {tractIndexEntry});
    }
  }


  onOpenRecordingActEditor(tractIndexEntry: TractIndexEntry) {
    sendEvent(this.tractIndexEntriesTableEvent,
      TractIndexEntriesTableEventType.RECORDING_ACT_CLICKED, {tractIndexEntry});
  }


  onOpenBookEntry(tractIndexEntry: TractIndexEntry) {
    sendEvent(this.tractIndexEntriesTableEvent,
      TractIndexEntriesTableEventType.BOOK_ENTRY_CLICKED, {tractIndexEntry});
  }


  onRemoveRecordingActClicked(tractIndexEntry: TractIndexEntry) {
    if (tractIndexEntry.actions.canBeDeleted) {
      const message = this.getConfirmMessageToRemove(tractIndexEntry);

      this.messageBox.confirm(message, 'Eliminar acto jurídico', 'DeleteCancel')
        .toPromise()
        .then(x => {
          if (x) {
            sendEvent(this.tractIndexEntriesTableEvent,
              TractIndexEntriesTableEventType.REMOVE_RECORDING_ACT_CLICKED, {tractIndexEntry});
          }
        });
    }
  }


  private setDataSource() {
    this.buildDataSource();
    this.resetColumns();
  }


  private buildDataSource() {
    let entries: TractIndexEntryDataTable[] = [];

    if (this.checkNestedEntries) {

      const childs: TractIndexEntryDataTable[] =
        [...[], ...this.tractIndexEntriesList.filter(e => !isEmpty(e.amendedAct))];

      const parents: TractIndexEntryDataTable[] =
        [...[], ...this.tractIndexEntriesList.filter(e => !childs.find(c => e.uid === c.uid))];

      parents.forEach((p, pi) => {
        this.pushEntryToDataSource(entries, p, (pi + 1).toString(), false);

        childs.filter(c => p.uid === c.amendedAct.uid)
              .forEach((c, ci) => this.pushEntryToDataSource(entries, c, (pi + 1) + '.' + (ci + 1), true));
      });

    } else {

      this.tractIndexEntriesList.forEach((entry, index) =>
        this.pushEntryToDataSource(entries, entry, (index + 1).toString(), false)
      );

    }

    this.dataSource = new MatTableDataSource(entries);
    this.dataSource.filterPredicate = this.getFilterPredicate();
  }


  private pushEntryToDataSource(entries: TractIndexEntryDataTable[],
                                entry: TractIndexEntryDataTable,
                                index: string,
                                isChild: boolean) {
    entry.isChild = isChild;
    entry.number = index;
    entries.push(entry);
  }


  private resetColumns() {
    this.displayedColumns = [...[], ...this.displayedColumnsDefault];

    if (this.canDelete && this.tractIndexEntriesList.filter(x => x.actions.canBeDeleted).length > 0) {
      this.displayedColumns.push('action');
    }
  }


  private getFilterPredicate() {
    return (row: TractIndexEntry, filters: any) => (
      this.filterByType(row, filters.entryType) && this.filterByKeyword(row, filters.keywords)
    );
  }


  private filterByType(row: TractIndexEntry, entryType: string) {
    return !entryType || row.entryType === entryType;
  }


  private filterByKeyword(row: TractIndexEntry, keywords: string) {
    return this.filterField(row.name, keywords) ||
           this.filterField(row.description, keywords) ||
           this.filterField(row.recordingData.description, keywords);
  }


  private filterField(field: string, filter: string): boolean {
    return !!field && field.toString().toLowerCase().includes(filter.trim().toLowerCase());
  }


  private applyFilter() {
    this.dataSource.filter = this.filter;
  }


  private getConfirmMessageToRemove(tractIndexEntry: TractIndexEntry): string {
    return `Esta operación eliminará el acto jurídico <strong>${tractIndexEntry.description}</strong> ` +
           `registrado en <strong>${tractIndexEntry.recordingData.description}</strong>.` +
           `<br><br>¿Elimino el acto jurídico?`;
  }

}
