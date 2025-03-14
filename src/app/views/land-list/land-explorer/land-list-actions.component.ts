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

  @Input() recorderOfficeList: RecorderOffice[] = [];

  @Input() explorerTypesList: Identifiable[] = [];

  @Input() statusList: Identifiable[] = [];

  @Input() displayStatusSelect: boolean = false;

  @Input() displayExplorerTypeSelect: boolean = false;

  @Input() displayReceiveButton: boolean = false;

  @Input() displayCreateButton: boolean = false;

  @Input() createPermission: PERMISSIONS = PERMISSIONS.FEATURE_TRANSACTIONS_ADD;

  @Output() listActionsEvent = new EventEmitter<EventInfo>();

  recorderOffice = '';

  status = '';

  explorerType = '';

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
    const payload = {
      explorerType: this.explorerType,
      recorderOfficeUID: this.recorderOffice,
      status: this.status,
      keywords: this.keywords
    };

    sendEvent(this.listActionsEvent, ListActionsEventType.FILTER_CHANGED, payload);
  }


  onCreateClicked() {
    sendEvent(this.listActionsEvent, ListActionsEventType.CREATE_CLICKED);
  }


  onReceiveOptionsClicked() {
    sendEvent(this.listActionsEvent, ListActionsEventType.RECEIVE_CLICKED);
  }

}
