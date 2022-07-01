/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { sendEvent } from '@app/shared/utils';

import { EmptyTractIndex, EmptyTractIndexEntry, TractIndex, TractIndexEntry,
         TractIndexEntryType } from '@app/models';

import { TractIndexEntriesFilterEventType } from './tract-index-entries-filter.component';

import { TractIndexEntriesTableEventType } from './tract-index-entries-table.component';


export enum TractIndexEntriesViewerEventType {
  SELECT_TRACT_INDEX_ENTRY   = 'TractIndexEntriesViewerComponent.Event.SelectTractIndexEntry',
  UNSELECT_TRACT_INDEX_ENTRY = 'TractIndexEntriesViewerComponent.Event.UnselectTractIndexEntry',
}

@Component({
  selector: 'emp-land-tract-index-entries-viewer',
  templateUrl: './tract-index-entries-viewer.component.html',
  styles: [`
    .viewer-shadow {
      box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.28);
    }
  `]
})
export class TractIndexEntriesViewerComponent implements OnDestroy {

  @Input() tractIndex: TractIndex = EmptyTractIndex;

  @Input() selectedTractIndexEntry: TractIndexEntry = EmptyTractIndexEntry;

  @Output() tractIndexEntriesViewerEvent = new EventEmitter<EventInfo>();

  cardHint = 'Seleccionar los filtros';

  isLoading = false;

  queryExecuted = false;

  tractIndexEntryType: TractIndexEntryType = null;

  filter: any = null;

  helper: SubscriptionHelper;


  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  onTractIndexEntriesFilterEvent(event: EventInfo) {
    switch (event.type as TractIndexEntriesFilterEventType) {
      case TractIndexEntriesFilterEventType.FILTER_CHANGED:
        Assertion.assertValue(event.payload.filter, 'event.payload.filter');
        this.filter = event.payload.filter;
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onTractIndexEntriesTableEvent(event: EventInfo) {
    switch (event.type as TractIndexEntriesTableEventType) {

      case TractIndexEntriesTableEventType.TRACT_INDEX_ENTRY_CLICKED:
        sendEvent(this.tractIndexEntriesViewerEvent, TractIndexEntriesViewerEventType.SELECT_TRACT_INDEX_ENTRY,
          event.payload);

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }

}
