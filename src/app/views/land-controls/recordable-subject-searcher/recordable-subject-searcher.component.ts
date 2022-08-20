/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { concat, Observable, of, Subject } from 'rxjs';

import { catchError, debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs/operators';

import { isEmpty } from '@app/core';

import { RecordableSubjectsDataService } from '@app/data-services';

import { RecordableSubjectFilter, RecordableSubjectShortModel, RecordableSubjectType } from '@app/models';

@Component({
  selector: 'emp-land-recordable-subject-searcher',
  templateUrl: './recordable-subject-searcher.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RecordableSubjectSearcherComponent),
      multi: true
    }
  ]
})
export class RecordableSubjectSearcherComponent implements OnInit, ControlValueAccessor {

  @Input() recordableSubjectMinTermLength = 5;

  @Input() allWidth = false;

  @Input() type: RecordableSubjectType = null;

  @Input() showError = false;

  @Output() changes = new EventEmitter<any>();

  recordableSubject: RecordableSubjectShortModel;

  onChange: (value: any) => void;

  onTouched: () => void;

  disabled: boolean;

  recordableSubjectList$: Observable<RecordableSubjectShortModel[]>;

  recordableSubjectInput$ = new Subject<string>();

  recordableSubjectLoading = false;


  constructor(private data: RecordableSubjectsDataService) { }


  ngOnInit(): void {
    this.subscribeRecordableSubjectList();
  }


  selectRecordableSubject(recordableSubject: RecordableSubjectShortModel) {
    this.onTouched();
    this.recordableSubject = recordableSubject;
    this.onChange(recordableSubject);
    this.changes.emit(recordableSubject);
  }


  writeValue(value: RecordableSubjectShortModel): void {
    this.recordableSubject = !isEmpty(value) ? value : null;
  }


  registerOnChange(fn: any): void {
    this.onChange = fn;
  }


  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }


  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }


  private subscribeRecordableSubjectList() {
    this.recordableSubjectList$ = concat(
      of([]),
      this.recordableSubjectInput$.pipe(
          filter(keyword => this.validRecordableSubjectFilter(keyword)),
          distinctUntilChanged(),
          debounceTime(800),
          tap(() => this.recordableSubjectLoading = true),
          switchMap(keyword => this.data.searchRecordableSubject(this.buildRecordableSubjectFilter(keyword))
            .pipe(
              catchError(() => of([])),
              tap(() => this.recordableSubjectLoading = false)
          ))
      )
    );
  }


  private validRecordableSubjectFilter(keyword: string): boolean {
    return !!this.type && keyword !== null && keyword.length >= this.recordableSubjectMinTermLength;
  }


  private buildRecordableSubjectFilter(keywords: string): RecordableSubjectFilter {
    const recordableSubjectFilter: RecordableSubjectFilter = {
      type: this.type,
      keywords
    };

    return recordableSubjectFilter;
  }

}
