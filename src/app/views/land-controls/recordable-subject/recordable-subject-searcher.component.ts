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

import { Empty, Identifiable, isEmpty } from '@app/core';

import { SearchServicesDataService } from '@app/data-services';

import { RecordableSubjectQueryResult, RecordableSubjectType, RecordSearchQuery } from '@app/models';

@Component({
  selector: 'emp-land-recordable-subject-searcher',
  templateUrl: './recordable-subject-searcher.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RecordableSubjectSearcherComponent),
      multi: true
    }
  ],
  styles: [`
    .searcher-item-container {
      font-size: 8pt;
      padding: 8px 4px 0 4px;
    }`
  ],
})
export class RecordableSubjectSearcherComponent implements OnInit, ControlValueAccessor {

  @Input() recordableSubjectMinTermLength = 5;

  @Input() allWidth = true;

  @Input() type: RecordableSubjectType = null;

  @Input() recorderOffice: Identifiable = Empty;

  @Input() showError = false;

  @Output() changes = new EventEmitter<any>();

  recordableSubject: RecordableSubjectQueryResult;

  onChange: (value: any) => void;

  onTouched: () => void;

  disabled: boolean;

  recordableSubjectList$: Observable<RecordableSubjectQueryResult[]>;

  recordableSubjectInput$ = new Subject<string>();

  recordableSubjectLoading = false;


  constructor(private data: SearchServicesDataService) { }


  ngOnInit(): void {
    this.subscribeRecordableSubjectList();
  }


  selectRecordableSubject(recordableSubject: RecordableSubjectQueryResult) {
    this.onTouched();
    this.recordableSubject = recordableSubject;
    this.onChange(recordableSubject);
    this.changes.emit(recordableSubject);
  }


  writeValue(value: RecordableSubjectQueryResult): void {
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


  private buildRecordableSubjectFilter(keywords: string): RecordSearchQuery {
    const query: RecordSearchQuery = {
      recorderOfficeUID: this.recorderOffice.uid,
      type: this.type,
      keywords
    };

    return query;
  }

}
