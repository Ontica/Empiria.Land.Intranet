/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { EmptyTractIndexEntry, TractIndexEntry} from '@app/models';

import { sendEvent } from '@app/shared/utils';

import {
  TractIndexEntriesTableEventType
} from '@app/views/land-controls/tract-index/tract-index-entries-table.component';

export enum TractIndexEntriesHistoryEventType {
  TRACT_INDEX_ENTRY_CLICKED = 'TractIndexEntriesHistoryComponent.Event.TractIndexEntryClicked',
}

@Component({
  selector: 'emp-land-tract-index-entries-history',
  templateUrl: './tract-index-entries-history.component.html',
})
export class TractIndexEntriesHistoryComponent   {

  @Input() tractIndexEntriesList: TractIndexEntry[] = [];

  @Input() filter: any = null;

  @Input() hasNestedEntries = false;

  @Input() selectedTractIndexEntry: TractIndexEntry = EmptyTractIndexEntry;

  @Output() tractIndexEntriesHistoryEvent = new EventEmitter<EventInfo>();


  onTractIndexEntriesTableEvent(event: EventInfo) {
    switch (event.type as TractIndexEntriesTableEventType) {

      case TractIndexEntriesTableEventType.TRACT_INDEX_ENTRY_CLICKED:
        Assertion.assertValue(event.payload.tractIndexEntry, 'event.payload.tractIndexEntry');

        sendEvent(this.tractIndexEntriesHistoryEvent,
          TractIndexEntriesHistoryEventType.TRACT_INDEX_ENTRY_CLICKED, event.payload);

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }

}
