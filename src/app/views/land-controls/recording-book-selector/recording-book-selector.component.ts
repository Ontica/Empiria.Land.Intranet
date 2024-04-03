/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output,
         SimpleChanges } from '@angular/core';

import { concat, Observable, of, Subject } from 'rxjs';

import { catchError, debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs/operators';

import { DateString, Empty, EventInfo, Identifiable, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { BookEntryShortModel, EmptyBookEntryShortModel, RecorderOffice } from '@app/models';

import { RecordableSubjectsStateSelector } from '@app/presentation/exported.presentation.types';

import { sendEvent } from '@app/shared/utils';


export enum RecordingBookSelectorEventType {
  RECORDING_BOOK_CHANGED   = 'RecordingBookSelectorComponent.Event.RecordingBookChanged',
  BOOK_ENTRY_CHANGED       = 'RecordingBookSelectorComponent.Event.BookEntryChanged',
  BOOK_ENTRY_CHECK_CHANGED = 'RecordingBookSelectorComponent.Event.BookEntryCheckChanged',
}


@Component({
  selector: 'emp-land-recording-book-selector',
  templateUrl: './recording-book-selector.component.html',
})
export class RecordingBookSelectorComponent implements OnInit, OnChanges, OnDestroy {

  @Input() checkBookEntryInput: boolean = false

  @Input() recorderOffice: Identifiable = Empty;

  @Input() fieldsRequired = true;

  @Input() showRecordingBookEntryField = true;

  @Input() selectorPosition: 'auto' | 'top' | 'bottom' = 'auto';

  @Output() recordingBookSelectorEvent = new EventEmitter<EventInfo>();

  helper: SubscriptionHelper;

  isLoading = false;

  recorderOfficeList: RecorderOffice[] = [];

  recordingBookList$: Observable<Identifiable[]>;
  recordingBookInput$ = new Subject<string>();
  recordingBookLoading = false;
  recordingBookMinTermLength = 3;

  recordingBookEntryList: BookEntryShortModel[] = [];

  recorderOfficeSelected: RecorderOffice;
  recordingSectionSelected: Identifiable;
  recordingBookSelected: Identifiable;
  recordingBookEntrySelected: BookEntryShortModel;

  bookEntryNo: string;
  presentationTime: DateString;
  authorizationDate: DateString;


  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit() {
    this.initForm();
    this.loadRecorderOfficeList();
    this.resetRecordingBookField();
    this.setRecorderOfficeDefault();
    this.recordingSectionSelected = null;
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.checkBookEntryInput) {
      this.recordingBookEntrySelected = null;
      this.bookEntryNo = null;
      this.presentationTime = null;
      this.authorizationDate = null;
    }

    if (changes.recorderOffice) {
      this.setRecorderOfficeDefault();
    }
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get isReadyToFilterRecordingBook(): boolean {
    return !isEmpty(this.recorderOfficeSelected) && !isEmpty(this.recordingSectionSelected);
  }


  get hasRecorderOfficeDefault(): boolean {
    return !isEmpty(this.recorderOffice);
  }


  onRecorderOfficeChange(){
    this.recordingSectionSelected = null;
    this.onRecordingSectionChange();
  }


  onRecordingSectionChange() {
    this.resetRecordingBookField();
    this.emitRecordingBook(Empty);
  }


  onRecordingBookChange(recordingBook: Identifiable) {
    this.resetRecordingBookEntries();
    this.loadRecordingBookEntryList();

    this.emitRecordingBook(isEmpty(recordingBook) ? Empty : this.recordingBookSelected);
  }


  onBookEntryChange(bookEntry: BookEntryShortModel) {
    this.emitBookEntry(isEmpty(bookEntry) ? EmptyBookEntryShortModel : this.recordingBookEntrySelected);
  }


  onBookEntryNoFieldsChange() {
    setTimeout(() => {
      const bookEntry: BookEntryShortModel = {
        uid: null,
        recordingNo: this.bookEntryNo,
        presentationTime: this.presentationTime,
        authorizationDate: this.authorizationDate,
      };

      sendEvent(this.recordingBookSelectorEvent, RecordingBookSelectorEventType.BOOK_ENTRY_CHANGED,
        {bookEntry});
    });
  }


  onCheckBookEntryInputChanged() {
    sendEvent(this.recordingBookSelectorEvent, RecordingBookSelectorEventType.BOOK_ENTRY_CHECK_CHANGED,
      { checkBookEntryInput: this.checkBookEntryInput });
  }


  private emitRecordingBook(recordingBook: Identifiable) {
    sendEvent(this.recordingBookSelectorEvent, RecordingBookSelectorEventType.RECORDING_BOOK_CHANGED,
      { recordingBook });

    this.clearBookEntry();
  }


  private clearBookEntry() {
    this.recordingBookEntrySelected = null;
    this.bookEntryNo = null;
    this.presentationTime = null;
    this.authorizationDate = null;
    this.emitBookEntry(EmptyBookEntryShortModel);
  }


  private emitBookEntry(bookEntry: BookEntryShortModel) {
    sendEvent(this.recordingBookSelectorEvent, RecordingBookSelectorEventType.BOOK_ENTRY_CHANGED,
      {bookEntry});
  }


  private initForm() {
    this.recorderOfficeSelected = null;
    this.recordingSectionSelected = null;
    this.recordingBookSelected = null;
    this.recordingBookEntrySelected = null;
    this.bookEntryNo = null;
    this.presentationTime = null;
    this.authorizationDate = null;
  }


  private loadRecorderOfficeList() {
    this.isLoading = true;
    this.helper.select<RecorderOffice[]>(RecordableSubjectsStateSelector.RECORDER_OFFICE_LIST)
      .subscribe(x => {
        this.recorderOfficeList = x;
        this.setRecorderOfficeDefault();
        this.isLoading = false;
      });
  }


  private setRecorderOfficeDefault() {
    const recorderOfficeDefault =
      this.recorderOfficeList.find(x => x.uid === this.recorderOffice.uid) ?? null;

    this.recorderOfficeSelected = this.hasRecorderOfficeDefault ? recorderOfficeDefault : null;
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

    this.helper.select<BookEntryShortModel[]>(RecordableSubjectsStateSelector.RECORDING_BOOK_ENTRIES_LIST,
                                       { recordingBookUID: this.recordingBookSelected?.uid })
      .toPromise()
      .then(x => {
        this.recordingBookEntryList = x;
        this.isLoading = false;
      });
  }

}
