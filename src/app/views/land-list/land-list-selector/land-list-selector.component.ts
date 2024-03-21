/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { Entity, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { LandEntity, TransactionDescriptor } from '@app/models';

export enum ListSelectorEventType {
  FILTER_CHANGED     = 'ListSelectorComponent.Event.FilterChanged',
  ITEMS_LIST_CHANGED = 'ListSelectorComponent.Event.ItemsListChanged',
}

@Component({
  selector: 'emp-land-list-selector',
  templateUrl: './land-list-selector.component.html',
})
export class ListSelectorComponent implements OnChanges, OnInit {

  @Input() itemsType: string = 'trámite';

  @Input() canEdit = true;

  @Input() itemsList: LandEntity[] = [];

  @Output() listSelectorEvent = new EventEmitter<EventInfo>();

  listOptions = [];

  searchUID = '';


  ngOnChanges(changes: SimpleChanges) {
    if (changes.canEdit || changes.itemsType) {
      this.buildListOptions();
    }
  }


  ngOnInit() {
    this.buildListOptions();
  }


  getTransaction(item: LandEntity) : TransactionDescriptor {
    return item as TransactionDescriptor;
  }


  removeFromList(row: Entity) {
    sendEvent(this.listSelectorEvent, ListSelectorEventType.ITEMS_LIST_CHANGED,
      { itemsList: this.itemsList.filter(x => x.uid !== row.uid) });
  }


  onChangeFilter() {
    if (this.searchUID) {
      sendEvent(this.listSelectorEvent, ListSelectorEventType.FILTER_CHANGED,
        {searchUID: this.searchUID});

      this.searchUID = '';
    }
  }


  private buildListOptions() {
    if (this.canEdit) {
      this.listOptions = [{ name: `Remover ${this.itemsType}`, value: 'RemoveItem', icon: 'close' }];
    } else {
      this.listOptions = [];
    }
  }

}
