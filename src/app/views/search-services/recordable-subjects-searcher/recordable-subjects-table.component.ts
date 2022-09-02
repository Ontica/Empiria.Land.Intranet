/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { EventInfo } from '@app/core';

import { EmptyRecordableSubject, getRecordableSubjectTypeName, RecordableSubject, RecordableSubjectShortModel,
         RecordableSubjectType } from '@app/models';

import { sendEvent } from '@app/shared/utils';

export enum RecordableSubjectsTableEventType {
  SELECT_RECORDABLE_SUBJECT = 'RecordableSubjectsTableComponent.Event.SelectRecordableSubject',
}

@Component({
  selector: 'emp-land-recordable-subjects-table',
  templateUrl: './recordable-subjects-table.component.html',
})
export class RecordableSubjectsTableComponent implements OnChanges  {

  @Input() recordableSubjectsList: RecordableSubjectShortModel[] = [];

  @Input() selectedRecordableSubject: RecordableSubject = EmptyRecordableSubject;

  @Input() isLoading = false;

  @Input() queryExecuted = false;

  @Output() recordableSubjectsTableEvent = new EventEmitter<EventInfo>();

  displayedColumns: string[] = ['type', 'kind', 'electronicID', 'name', 'status'];

  dataSource: MatTableDataSource<RecordableSubjectShortModel>;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.recordableSubjectsList) {
      this.dataSource = new MatTableDataSource(this.recordableSubjectsList);
    }
  }


  getRecordableSubjectTypeName(type: RecordableSubjectType): string {
    return getRecordableSubjectTypeName(type);
  }


  onSelecteRecordableSubjectClicked(recordableSubject: RecordableSubjectShortModel) {
    sendEvent(this.recordableSubjectsTableEvent, RecordableSubjectsTableEventType.SELECT_RECORDABLE_SUBJECT,
      {recordableSubject});
  }

}
