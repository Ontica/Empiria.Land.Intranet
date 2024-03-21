/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { EventInfo, Identifiable } from '@app/core';

import { PERMISSIONS } from '@app/main-layout';

import { sendEvent } from '@app/shared/utils';


export enum ListActionsEventType {
  CREATE_CLICKED  = 'ListActionsComponent.Event.CreateClicked',
  FILTER_CHANGED  = 'ListActionsComponent.Event.FilterChanged',
  RECEIVE_CLICKED = 'ListActionsComponent.Event.ReceiveClicked',
}

@Component({
  selector: 'emp-land-list-actions',
  templateUrl: './land-list-actions.component.html',
})
export class ListActionsComponent implements OnChanges {

  @Input() statusList: Identifiable[] = [];

  @Input() queryKeywords: string = '';

  @Input() queryStatus: string = '';

  @Input() displayStatusSelect: boolean = false;

  @Input() displayReceiveButton: boolean = false;

  @Input() displayCreateButton: boolean = false;

  @Input() createPermission: PERMISSIONS = PERMISSIONS.FEATURE_TRANSACTIONS_ADD;

  @Output() listActionsEvent = new EventEmitter<EventInfo>();

  status = '';

  keywords = '';


  constructor() { }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.queryKeywords) {
      this.keywords = this.queryKeywords;
    }

    if (changes.queryStatus) {
      this.status = this.queryStatus ?? null;
    }
  }


  onFilterChanged() {
    sendEvent(this.listActionsEvent, ListActionsEventType.FILTER_CHANGED,
      { keywords: this.keywords, status: this.status });
  }


  onCreateClicked() {
    sendEvent(this.listActionsEvent, ListActionsEventType.CREATE_CLICKED);
  }


  onReceiveOptionsClicked() {
    sendEvent(this.listActionsEvent, ListActionsEventType.RECEIVE_CLICKED);
  }

}
