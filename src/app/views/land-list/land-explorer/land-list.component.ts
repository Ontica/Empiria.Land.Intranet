/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, Output, EventEmitter } from '@angular/core';

import { SelectionModel } from '@angular/cdk/collections';

import { Empty, Entity, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { LandEntity, TransactionDescriptor } from '@app/models';

export enum ListEventType {
  ITEM_SELECTED          = 'ListComponent.Event.ItemSelected',
  ITEM_EXECUTE_OPERATION = 'ListComponent.Event.ItemExecuteOperation',
}

@Component({
  selector: 'emp-land-list',
  templateUrl: './land-list.component.html',
})
export class ListComponent {

  @Input() itemsType: string = 'trámite';

  @Input() itemsList: LandEntity[] = [];

  @Input() selectedItemUID: string = null;

  @Input() selection = new SelectionModel<LandEntity>(true, []);

  @Input() isLoading = false;

  @Output() listEvent = new EventEmitter<EventInfo>();


  getTransaction(item: LandEntity): TransactionDescriptor {
    return item as TransactionDescriptor;
  }


  onItemClicked(item: Entity) {
    sendEvent(this.listEvent, ListEventType.ITEM_SELECTED, { item });
  }


  onItemOperationClicked(item: Entity) {
    sendEvent(this.listEvent, ListEventType.ITEM_EXECUTE_OPERATION, { item });
  }

}
