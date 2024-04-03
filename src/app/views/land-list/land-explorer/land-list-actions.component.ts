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

import { EmptyLandQuery, LandQuery, RecorderOffice } from '@app/models';


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

  @Input() query: LandQuery = EmptyLandQuery;

  @Input() statusList: Identifiable[] = [];

  @Input() recorderOfficeList: RecorderOffice[] = [];

  @Input() displayStatusSelect: boolean = false;

  @Input() displayReceiveButton: boolean = false;

  @Input() displayCreateButton: boolean = false;

  @Input() createPermission: PERMISSIONS = PERMISSIONS.FEATURE_TRANSACTIONS_ADD;

  @Output() listActionsEvent = new EventEmitter<EventInfo>();

  recorderOffice = '';

  status = '';

  keywords = '';

  isLoading = false;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.query) {
      this.recorderOffice = this.query.recorderOfficeUID ?? null;
      this.status = this.query.status ?? null;
      this.keywords = this.query.keywords ?? null;
    }
  }


  onFilterChanged() {
    sendEvent(this.listActionsEvent, ListActionsEventType.FILTER_CHANGED,
      { recorderOfficeUID: this.recorderOffice, status: this.status, keywords: this.keywords });
  }


  onCreateClicked() {
    sendEvent(this.listActionsEvent, ListActionsEventType.CREATE_CLICKED);
  }


  onReceiveOptionsClicked() {
    sendEvent(this.listActionsEvent, ListActionsEventType.RECEIVE_CLICKED);
  }

}
