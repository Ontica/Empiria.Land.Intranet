/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';

import { EventInfo, Identifiable } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { RecordableSubjectsStateSelector } from '@app/presentation/exported.presentation.types';

import { EmptyRecordSearchQuery, RecordSearchQuery, RecordableSubjectType, RecordSearchTypeList,
         RecorderOffice } from '@app/models';

export enum RecordSearchFilterEventType {
  FILTER_CHANGED = 'RecordSearchFilterComponent.Event.FilterChanged',
}

@Component({
  selector: 'emp-land-record-search-filter',
  templateUrl: './record-search-filter.component.html',
})
export class RecordSearchFilterComponent implements OnChanges, OnInit, OnDestroy {

 @Input() query: RecordSearchQuery = EmptyRecordSearchQuery;

  @Output() recordSearchFilterEvent = new EventEmitter<EventInfo>();

  formData = {
    recorderOfficeUID: '',
    type: '',
    keywords: '',
  };

  recordSearchTypeList: Identifiable[] = RecordSearchTypeList;

  recorderOfficeList: Identifiable[] = [];

  isLoading = false;

  helper: SubscriptionHelper;


  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnChanges() {
    this.initFormData();
  }


  ngOnInit() {
    this.loadRecorderOfficeList();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get isFormValid(): boolean {
    return !!this.formData.keywords && !!this.formData.type;
  }


  onClearKeywords() {
    this.formData.keywords = '';
    this.onFilterChanges();
  }


  onFilterChanges() {
    sendEvent(this.recordSearchFilterEvent, RecordSearchFilterEventType.FILTER_CHANGED,
      {query: this.getRecordSearchQuery()});
  }


  private loadRecorderOfficeList() {
    this.isLoading = true;
    this.helper.select<RecorderOffice[]>(RecordableSubjectsStateSelector.RECORDER_OFFICE_LIST)
      .subscribe(x => {
        this.recorderOfficeList = x;
        this.isLoading = false;
      });
  }


  private initFormData() {
    this.formData = {
      recorderOfficeUID: this.query.recorderOfficeUID,
      type: this.query.type,
      keywords: this.query.keywords,
    };
  }


  private getRecordSearchQuery(): RecordSearchQuery {
    const query: RecordSearchQuery = {
      recorderOfficeUID: this.formData.recorderOfficeUID,
      type: this.formData.type as RecordableSubjectType ?? null,
      keywords: this.formData.keywords,
    };

    return query;
  }

}
