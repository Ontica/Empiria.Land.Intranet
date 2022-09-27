/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { EventInfo, Identifiable } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { EmptyRecordSearchQuery, RecordSearchQuery, RecordableSubjectType,
         RecordSearchTypeList } from '@app/models';

export enum RecordSearchFilterEventType {
  FILTER_CHANGED = 'RecordSearchFilterComponent.Event.FilterChanged',
}

@Component({
  selector: 'emp-land-record-search-filter',
  templateUrl: './record-search-filter.component.html',
})
export class RecordSearchFilterComponent implements OnChanges {

 @Input() query: RecordSearchQuery = EmptyRecordSearchQuery;

  @Output() recordSearchFilterEvent = new EventEmitter<EventInfo>();

  formData = {
    type: '',
    municipality: '',
    filterBy: '',
    keywords: '',
  };

  recordSearchTypeList: Identifiable[] = RecordSearchTypeList;

  municipalityList: Identifiable[] = [];

  filterByList: Identifiable[] = [];

  ngOnChanges() {
    this.initFormData();
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


  private initFormData() {
    this.formData = {
      type: this.query.type,
      municipality: this.query.municipality,
      filterBy: this.query.filterBy,
      keywords: this.query.keywords,
    };
  }


  private getRecordSearchQuery(): RecordSearchQuery {
    const query: RecordSearchQuery = {
      type: this.formData.type as RecordableSubjectType ?? null,
      municipality: this.formData.municipality,
      filterBy: this.formData.filterBy,
      keywords: this.formData.keywords,
    };

    return query;
  }

}
