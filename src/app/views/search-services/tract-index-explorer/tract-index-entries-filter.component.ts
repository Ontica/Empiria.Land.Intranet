/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { EventInfo, Identifiable } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { TractIndexEntryType, TractIndexEntryTypeList } from '@app/models';

export enum TractIndexEntriesFilterEventType {
  FILTER_CHANGED = 'TractIndexEntriesFilterComponent.Event.FilterChanged',
}

@Component({
  selector: 'emp-land-tract-index-entries-filter',
  templateUrl: './tract-index-entries-filter.component.html',
})
export class TractIndexEntriesFilterComponent implements OnInit {

  @Input() tractIndexEntryType: TractIndexEntryType = TractIndexEntryType.RecordingAct;

  @Input() hasNestedEntries = false;

  @Output() tractIndexEntriesFilterEvent = new EventEmitter<EventInfo>();

  formData = {
    entryType: '',
    keywords: '',
    checkNestedEntries: false,
  };

  tractIndexEntryTypeList: Identifiable[] = TractIndexEntryTypeList ?? [];

  ngOnInit() {
    this.initFormData();
  }


  onClearKeywords() {
    this.formData.keywords = '';
    this.onFilterChanges();
  }


  onFilterChanges() {
    const filter = {
      entryType: this.formData.entryType,
      keywords: this.formData.keywords,
      checkNestedEntries: this.formData.checkNestedEntries,
    };

    sendEvent(this.tractIndexEntriesFilterEvent, TractIndexEntriesFilterEventType.FILTER_CHANGED, {filter});
  }


  private initFormData() {
    this.formData = {
      entryType: this.tractIndexEntryType,
      keywords: '',
      checkNestedEntries: false,
    };
  }

}
