/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { EventInfo, Identifiable } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { EmptyRecordableSubjectFilter, RecordableSubjectFilter, RecordableSubjectType,
         RecordableSubjectTypeList } from '@app/models';

export enum RecordableSubjectsFilterEventType {
  FILTER_CHANGED = 'RecordableSubjectsFilterComponent.Event.FilterChanged',
}

@Component({
  selector: 'emp-land-recordable-subjects-filter',
  templateUrl: './recordable-subjects-filter.component.html',
})
export class RecordableSubjectsFilterComponent implements OnChanges {

  @Input() filter: RecordableSubjectFilter = EmptyRecordableSubjectFilter;

  @Output() recordableSubjectsFilterEvent = new EventEmitter<EventInfo>();

  formData = {
    type: '',
    keywords: '',
  };

  recordableSubjectTypeList: Identifiable[] = RecordableSubjectTypeList ?? [];

  ngOnChanges() {
    this.initFormData();
  }


  onTypeChanges() {
    if (!!this.formData.keywords) {
      this.onFilterChanges();
    }
  }


  onClearKeywords() {
    this.formData.keywords = '';
    this.onFilterChanges();
  }


  onFilterChanges() {
    sendEvent(this.recordableSubjectsFilterEvent,
      RecordableSubjectsFilterEventType.FILTER_CHANGED,
      { recordableSubjectFilter: this.getRecordableSubjectFilter()});
  }


  private initFormData() {
    this.formData = {
      type: this.filter.type,
      keywords: this.filter.keywords,
    };
  }


  private getRecordableSubjectFilter(): RecordableSubjectFilter {
    const data: RecordableSubjectFilter = {
      type: this.formData.type as RecordableSubjectType ?? null,
      keywords: this.formData.keywords,
    };

    return data;
  }

}
