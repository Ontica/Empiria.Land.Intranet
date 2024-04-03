/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

import { SelectionModel } from '@angular/cdk/collections';

import { Assertion, EventInfo, Identifiable } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { LandEntity, LandQuery, EmptyLandQuery, LandExplorerTypes, RecorderOffice } from '@app/models';

import { ListControlsEventType } from '@app/views/land-list/land-explorer/land-list-controls.component';

import { ListActionsEventType } from '@app/views/land-list/land-explorer/land-list-actions.component';

import { ListEventType } from '@app/views/land-list/land-explorer/land-list.component';


export enum LandExplorerEventType {
  CREATE_ITEM_CLICKED     = 'LandExplorerComponent.Event.CreateClicked',
  FILTER_CHANGED          = 'LandExplorerComponent.Event.FilterChanged',
  RECEIVE_ITEMS_CLICKED   = 'LandExplorerComponent.Event.ReceiveClicked',
  ITEM_SELECTED           = 'LandExplorerComponent.Event.ItemSelected',
  ITEM_EXECUTE_OPERATION  = 'LandExplorerComponent.Event.ItemExecuteOperation',
  ITEMS_EXECUTE_OPERATION = 'LandExplorerComponent.Event.ItemsExecuteOperation',
}

@Component({
  selector: 'emp-land-explorer',
  templateUrl: './land-explorer.component.html',
})
export class LandExplorerComponent implements OnChanges {

  @Input() title = 'Trámites';

  @Input() explorerType = LandExplorerTypes.Transaction;

  @Input() itemsList: LandEntity[] = [];

  @Input() selectedItemUID: string = null;

  @Input() query: LandQuery = EmptyLandQuery;

  @Input() operationsList: Identifiable[] = [];

  @Input() recorderOfficeList: RecorderOffice[] = [];

  @Input() statusList: Identifiable[] = [];

  @Input() canSelectStatus: boolean = false;

  @Input() canReceive: boolean = false;

  @Input() canCreate: boolean = false;

  @Input() isLoading = false;

  @Output() landExplorerEvent = new EventEmitter<EventInfo>();

  selection = new SelectionModel<LandEntity>(true, []);

  landExplorerTypes = LandExplorerTypes;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.query || changes.itemsList) {
      this.selection.clear();
    }
  }


  onListActionsEvent(event: EventInfo) {
    switch (event.type as ListActionsEventType) {
      case ListActionsEventType.FILTER_CHANGED:
        sendEvent(this.landExplorerEvent, LandExplorerEventType.FILTER_CHANGED, event.payload);
        return;

      case ListActionsEventType.CREATE_CLICKED:
        sendEvent(this.landExplorerEvent, LandExplorerEventType.CREATE_ITEM_CLICKED);
        return;

      case ListActionsEventType.RECEIVE_CLICKED:
        sendEvent(this.landExplorerEvent, LandExplorerEventType.RECEIVE_ITEMS_CLICKED);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onListControlsEvent(event: EventInfo) {
    switch (event.type as ListControlsEventType) {
      case ListControlsEventType.EXECUTE_OPERATION_CLICKED:
        Assertion.assertValue(event.payload.operation, 'event.payload.operation');
        Assertion.assertValue(event.payload.selection, 'event.payload.selection');

        const payload = {
          operation: event.payload.operation,
          items: event.payload.selection,
        };

        sendEvent(this.landExplorerEvent, LandExplorerEventType.ITEMS_EXECUTE_OPERATION, payload);

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onListEvent(event: EventInfo) {
    switch (event.type as ListEventType) {
      case ListEventType.ITEM_SELECTED:
        Assertion.assertValue(event.payload.item, 'event.payload.item');
        sendEvent(this.landExplorerEvent, LandExplorerEventType.ITEM_SELECTED, event.payload);
        return;

      case ListEventType.ITEM_EXECUTE_OPERATION:
        Assertion.assertValue(event.payload.item, 'event.payload.item');
        sendEvent(this.landExplorerEvent, LandExplorerEventType.ITEM_EXECUTE_OPERATION, event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }

}
