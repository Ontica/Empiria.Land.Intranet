/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Assertion, EventInfo, Identifiable, isEmpty } from '@app/core';
import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';
import { BookEntry, RecorderOffice, RecordingBook } from '@app/models';
import { RecordableSubjectsStateSelector,
         TransactionStateSelector } from '@app/presentation/exported.presentation.types';
import { concat, Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs/operators';

export enum RecordingBookSelectorEventType {
  RECORDING_BOOK_CLICKED = 'RecordingBookSelectorComponent.Event.RecordingBookClicked',
  RECORDING_BOOK_ENTRY_CLICKED = 'RecordingBookSelectorComponent.Event.RecordingBookEntryClicked',
}

@Component({
  selector: 'emp-land-recording-book-selector',
  templateUrl: './recording-book-selector.component.html',
})
export class RecordingBookSelectorComponent implements OnInit, OnDestroy {

  @Input() showRecordingBookEntryField: boolean;

  @Output() recordingBookSelectorEvent = new EventEmitter<EventInfo>();

  helper: SubscriptionHelper;

  isLoading = false;

  recorderOfficeList: Identifiable[] = [];
  recordingSectionList: Identifiable[] = [];

  recordingBookList$: Observable<Identifiable[]>;
  recordingBookInput$ = new Subject<string>();
  recordingBookLoading = false;
  recordingBookMinTermLength = 3;

  recordingBookEntryList: Identifiable[] = [];

  recorderOfficeSelected: Identifiable;
  recordingSectionSelected: Identifiable;
  recordingBookSelected: Identifiable;
  recordingBookEntrySelected: Identifiable;

  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
  }

  ngOnInit(): void {
    this.initForm();
    this.initLoad();
    this.resetRecordingBookField();
    this.recorderOfficeSelected = null;
    this.recordingSectionSelected = null;
  }

  ngOnDestroy() {
    this.helper.destroy();
  }

  get isReadyToFilterRecordingBook(){
    return this.recorderOfficeSelected && this.recordingSectionSelected;
  }


  onRecorderOfficeChange(recorderOffice: RecorderOffice){
    this.recordingSectionSelected = null;
    this.resetRecordingBookField();
  }


  onRecordingSectionChange(recordingSection: Identifiable) {
    this.resetRecordingBookField();
  }


  onRecordingBookChange(recordingBook: Identifiable) {
    this.resetRecordingBookEntries();
    this.loadRecordingBookEntryList();
  }


  onRecordingBookClicked(){
    if (this.recordingBookSelected) {
      this.sendEvent(RecordingBookSelectorEventType.RECORDING_BOOK_CLICKED,
                    { recordingBook: this.getRecordingBookData() });
    }
  }


  onRecordingBookEntryClicked(){
    if (this.recordingBookEntrySelected) {
      this.sendEvent(RecordingBookSelectorEventType.RECORDING_BOOK_ENTRY_CLICKED,
                    { bookEntry: this.getBookEntryData() });
    }
  }


  private initForm() {
    this.recorderOfficeSelected = null;
    this.recordingSectionSelected = null;
    this.recordingBookSelected = null;
    this.recordingBookEntrySelected = null;
  }


  private initLoad() {
    this.isLoading = true;

    this.helper.select<Identifiable[]>(TransactionStateSelector.FILING_OFFICE_LIST)
      .subscribe(x => {
        this.recorderOfficeList = x;
      });

    this.helper.select<Identifiable[]>(TransactionStateSelector.RECORDING_SECTION_LIST)
      .subscribe(x => {
        this.recordingSectionList = x;
        this.isLoading = false;
      });
  }


  private resetRecordingBookField(){
    this.recordingBookSelected = null;
    this.subscribeRecordingBookList();
    this.resetRecordingBookEntries();
  }


  private resetRecordingBookEntries(){
    this.recordingBookEntrySelected = null;
    this.recordingBookEntryList = [];
  }


  private subscribeRecordingBookList() {
    this.recordingBookList$ = concat(
      of([]),
      this.recordingBookInput$.pipe(
        filter(keyword => keyword !== null && keyword.length >= this.recordingBookMinTermLength),
        distinctUntilChanged(),
        debounceTime(800),
        tap(() => this.recordingBookLoading = true),
        switchMap(keyword => this.helper.select<any[]>(RecordableSubjectsStateSelector.RECORDING_BOOKS_LIST,
                             this.buildRecordingBookFilter(keyword))
          .pipe(
            catchError(() => of([])),
            tap(() => this.recordingBookLoading = false)
        ))
      )
    );
  }


  private buildRecordingBookFilter(keywords: string): any {
    const recordingBookFilter = {
      recorderOfficeUID: this.recorderOfficeSelected?.uid,
      recordingSectionUID: this.recordingSectionSelected?.uid,
      keywords
    };

    return recordingBookFilter;
  }


  private loadRecordingBookEntryList() {

    if (!this.showRecordingBookEntryField) {
      return;
    }

    if (!this.recordingBookSelected?.uid) {
      this.recordingBookEntryList = [];
      return;
    }

    this.isLoading = true;

    this.helper.select<Identifiable[]>(RecordableSubjectsStateSelector.RECORDING_BOOK_ENTRIES_LIST,
                                       { recordingBookUID: this.recordingBookSelected?.uid })
      .toPromise()
      .then(x => {
        this.recordingBookEntryList = x;
        this.isLoading = false;
      });
  }


  private getRecordingBookData(): RecordingBook{
    Assertion.assert(!isEmpty(this.recordingBookSelected),
      'Programming error: form must be validated before command execution.');

    // TODO: define the correct interface
    const data: RecordingBook = {
      uid: this.recordingBookSelected?.uid,
      volumeNo: this.recordingBookSelected?.name,
      recorderOfficeName: this.recorderOfficeSelected.name,
      recordingSectionName: this.recordingSectionSelected.name,
      BookEntryList: this.recordingBookEntryList,
    };

    return data;
  }

  private getBookEntryData(): BookEntry{
    Assertion.assert(!isEmpty(this.recordingBookEntrySelected),
      'Programming error: form must be validated before command execution.');

    // TODO: define the correct interface
    const data: BookEntry = {
      uid: this.recordingBookEntrySelected?.uid,
      name: this.recordingBookEntrySelected?.name,
    };

    return data;
  }


  private sendEvent(eventType: RecordingBookSelectorEventType, payload?: any) {
    const event: EventInfo = {
      type: eventType,
      payload
    };

    this.recordingBookSelectorEvent.emit(event);
  }

}
