/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';

import { EventInfo, Identifiable } from '@app/core';

import { PERMISSIONS } from '@app/main-layout';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { RecordableSubjectsStateSelector } from '@app/presentation/exported.presentation.types';

import { sendEvent } from '@app/shared/utils';

import { RecorderOffice } from '@app/models';


export enum ListActionsEventType {
  CREATE_CLICKED  = 'ListActionsComponent.Event.CreateClicked',
  FILTER_CHANGED  = 'ListActionsComponent.Event.FilterChanged',
  RECEIVE_CLICKED = 'ListActionsComponent.Event.ReceiveClicked',
}

@Component({
  selector: 'emp-land-list-actions',
  templateUrl: './land-list-actions.component.html',
})
export class ListActionsComponent implements OnChanges, OnInit, OnDestroy {

  @Input() statusList: Identifiable[] = [];

  @Input() queryRecorderOffice: string = '';

  @Input() queryStatus: string = '';

  @Input() queryKeywords: string = '';

  @Input() displayStatusSelect: boolean = false;

  @Input() displayReceiveButton: boolean = false;

  @Input() displayCreateButton: boolean = false;

  @Input() createPermission: PERMISSIONS = PERMISSIONS.FEATURE_TRANSACTIONS_ADD;

  @Output() listActionsEvent = new EventEmitter<EventInfo>();

  recorderOffice = '';

  status = '';

  keywords = '';

  isLoading = false;

  recorderOfficeList: RecorderOffice[] = [];

  helper: SubscriptionHelper;


  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnChanges(changes: SimpleChanges) {
    // TODO: fix double request due toby "selectFirst=true"
    if (changes.queryRecorderOffice) {
      this.recorderOffice = this.queryRecorderOffice;
    }

    if (changes.queryStatus) {
      this.status = this.queryStatus ?? null;
    }

    if (changes.queryKeywords) {
      this.keywords = this.queryKeywords;
    }
  }


  ngOnInit() {
    this.loadRecorderOfficeList();
  }


  ngOnDestroy() {
    this.helper.destroy();
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


  private loadRecorderOfficeList() {
    this.isLoading = true;
    this.helper.select<RecorderOffice[]>(RecordableSubjectsStateSelector.RECORDER_OFFICE_LIST)
      .subscribe(x => {
        this.recorderOfficeList = x;
        this.isLoading = false;
        // this.setRecorderOffice();
      });
  }


  // private setRecorderOffice() {
  //   this.recorderOffice = this.recorderOfficeList.length > 0 ? this.recorderOfficeList[0].uid : null;
  // }

}
