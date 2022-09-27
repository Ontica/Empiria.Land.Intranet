/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { RecordSearchResult } from '@app/models';

import { sendEvent } from '@app/shared/utils';

import { RecordSearchListItemEventType } from './record-search-list-item.component';

export enum RecordSearchListEventType {
  SELECT_RECORDABLE_SUBJECT = 'RecordSearchListComponent.Event.SelectRecordableSubject',
}

@Component({
  selector: 'emp-land-record-search-list',
  templateUrl: './record-search-list.component.html',
})
export class RecordSearchListComponent {

  @Input() recordsList: RecordSearchResult[] = [];

  @Input() recordSearchType: string;

  @Input() queryExecuted = false;

  @Input() isLoading = false;

  @Output() recordSearchListEvent = new EventEmitter<EventInfo>();


  onRecordSearchListItemEvent(event: EventInfo) {

    switch (event.type as RecordSearchListItemEventType) {

      case RecordSearchListItemEventType.RECORDABLE_SUBJECT_CLICKED:
        Assertion.assertValue(event.payload.record, 'event.payload.record');
        sendEvent(this.recordSearchListEvent,
          RecordSearchListEventType.SELECT_RECORDABLE_SUBJECT, event.payload);
        return;

      case RecordSearchListItemEventType.CADASTRAL_CLICKED:
      case RecordSearchListItemEventType.TRANSACTION_CLICKED:
      case RecordSearchListItemEventType.RECORD_CLICKED:
        console.log(event);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }

}
