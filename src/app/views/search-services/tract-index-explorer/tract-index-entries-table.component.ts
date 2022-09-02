/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { EventInfo } from '@app/core';

import { EmptyTractIndexEntry, TractIndexEntry} from '@app/models';

import { sendEvent } from '@app/shared/utils';

export enum TractIndexEntriesTableEventType {
  TRACT_INDEX_ENTRY_CLICKED = 'TractIndexEntriesTableComponent.Event.TractIndexEntryClicked',
}

@Component({
  selector: 'emp-land-tract-index-entries-table',
  templateUrl: './tract-index-entries-table.component.html',
})
export class TractIndexEntriesTableComponent implements OnChanges  {

  @Input() tractIndexEntriesList: TractIndexEntry[] = [];

  @Input() filter: any = null;

  @Input() selectedTractIndexEntry: TractIndexEntry = EmptyTractIndexEntry;

  @Output() tractIndexEntriesTableEvent = new EventEmitter<EventInfo>();

  displayedColumns: string[] = ['description', 'documentID', 'transactionID', 'status'];

  dataSource: MatTableDataSource<TractIndexEntry>;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.tractIndexEntriesList) {
      this.setDataSource();
    }

    if (changes.filter) {
      this.applyFilter();
    }
  }


  onTractIndexEntryClicked(tractIndexEntry: TractIndexEntry) {
    sendEvent(this.tractIndexEntriesTableEvent,
      TractIndexEntriesTableEventType.TRACT_INDEX_ENTRY_CLICKED, {tractIndexEntry});
  }


  private setDataSource() {
    this.dataSource = new MatTableDataSource(this.tractIndexEntriesList);
    this.dataSource.filterPredicate = this.getFilterPredicate();
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
    return this.filterField(row.description, keywords) ||
           this.filterField(row.transaction.transactionID, keywords) ||
           this.filterField(row.officialDocument.documentID, keywords)
  }


  private filterField(field: string, filter: string): boolean {
    return field.toString().toLowerCase().includes(filter.trim().toLowerCase());
  }


  private applyFilter() {
    this.dataSource.filter = this.filter;
  }

}
