/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output,
         SimpleChanges } from '@angular/core';

import { combineLatest, concat, Observable, of, Subject } from 'rxjs';

import { catchError, debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs/operators';

import { Empty, EventInfo, Identifiable, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { BookEntryShortModel, EmptyBookEntryShortModel, RecorderOffice } from '@app/models';

import { RecordableSubjectsStateSelector,
         TransactionStateSelector } from '@app/presentation/exported.presentation.types';



export enum RecordingBookSelectorEventType {
  RECORDING_BOOK_CLICKED = 'RecordingBookSelectorComponent.Event.RecordingBookClicked',
  BOOK_ENTRY_CLICKED = 'RecordingBookSelectorComponent.Event.BookEntryClicked',
  RECORDING_BOOK_CHANGED = 'RecordingBookSelectorComponent.Event.RecordingBookChanged',
  BOOK_ENTRY_CHANGED = 'RecordingBookSelectorComponent.Event.BookEntryChanged',
}


@Component({
  selector: 'emp-land-recording-book-selector',
  templateUrl: './recording-book-selector.component.html',
})
export class RecordingBookSelectorComponent implements OnInit, OnChanges, OnDestroy {

  @Input() bookEntryButtonText = 'Editar';

  @Input() bookEntryInput = false;

  @Input() fieldsRequired = false;

  @Input() selectorPosition: 'auto' | 'top' | 'bottom' = 'auto';

  @Input() showBookEntryButton = false;

  @Input() showRecordingBookButton = false;

  @Input() showRecordingBookEntryField = false;

  @Input() recordingBookButtonText = 'Ver';

  @Output() recordingBookSelectorEvent = new EventEmitter<EventInfo>();

  helper: SubscriptionHelper;

  isLoading = false;

  recorderOfficeList: Identifiable[] = [];
  recordingSectionList: Identifiable[] = [];

  recordingBookList$: Observable<Identifiable[]>;
  recordingBookInput$ = new Subject<string>();
  recordingBookLoading = false;
  recordingBookMinTermLength = 3;

  recordingBookEntryList: BookEntryShortModel[] = [];

  recorderOfficeSelected: Identifiable;
  recordingSectionSelected: Identifiable;
  recordingBookSelected: Identifiable;
  recordingBookEntrySelected: BookEntryShortModel;
  bookEntryNo: string;

  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit(): void {
    this.initForm();
    this.loadDataLists();
    this.resetRecordingBookField();
    this.recorderOfficeSelected = null;
    this.recordingSectionSelected = null;
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.bookEntryInput) {
      this.recordingBookEntrySelected = null;
      this.bookEntryNo = null;
    }
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
    this.emitRecordingBook(Empty);
  }


  onRecordingSectionChange(recordingSection: Identifiable) {
    this.resetRecordingBookField();
    this.emitRecordingBook(Empty);
  }


  onRecordingBookChange(recordingBook: Identifiable) {
    this.resetRecordingBookEntries();
    this.loadRecordingBookEntryList();

    this.emitRecordingBook(isEmpty(recordingBook) ? Empty : this.recordingBookSelected);
  }


  onBookEntryChange(bookEntry: BookEntryShortModel) {
    this.emitBookEntry(isEmpty(bookEntry) ? EmptyBookEntryShortModel : this.recordingBookEntrySelected );
  }


  onBookEntryNoChange(bookEntryNo: string) {
    this.sendEvent(RecordingBookSelectorEventType.BOOK_ENTRY_CHANGED,
      { bookEntry: { recordingNo: bookEntryNo } });
  }


  onRecordingBookClicked(){
    if (this.recordingBookSelected) {
      this.sendEvent(RecordingBookSelectorEventType.RECORDING_BOOK_CLICKED,
        { recordingBook: this.recordingBookSelected });
    }
  }


  onRecordingBookEntryClicked(){
    if (this.recordingBookEntrySelected) {
      this.sendEvent(RecordingBookSelectorEventType.BOOK_ENTRY_CLICKED,
        { recordingBookEntry: this.recordingBookEntrySelected });
    }
  }


  private emitRecordingBook(recordingBook: Identifiable) {
    this.sendEvent(RecordingBookSelectorEventType.RECORDING_BOOK_CHANGED, { recordingBook });
    this.emitBookEntry(EmptyBookEntryShortModel);
  }


  private emitBookEntry(bookEntry: BookEntryShortModel) {
    this.sendEvent(RecordingBookSelectorEventType.BOOK_ENTRY_CHANGED, { bookEntry });
  }


  private initForm() {
    this.recorderOfficeSelected = null;
    this.recordingSectionSelected = null;
    this.recordingBookSelected = null;
    this.recordingBookEntrySelected = null;
  }


  private loadDataLists() {
    this.isLoading = true;

    combineLatest([
      this.helper.select<Identifiable[]>(TransactionStateSelector.FILING_OFFICE_LIST),
      this.helper.select<Identifiable[]>(TransactionStateSelector.RECORDING_SECTION_LIST),
    ])
    .subscribe(([a, b]) => {
        this.recorderOfficeList = a;
        this.recordingSectionList = b;
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

    this.helper.select<BookEntryShortModel[]>(RecordableSubjectsStateSelector.RECORDING_BOOK_ENTRIES_LIST,
                                       { recordingBookUID: this.recordingBookSelected?.uid })
      .toPromise()
      .then(x => {
        this.recordingBookEntryList = x;
        this.isLoading = false;
      });
  }


  private sendEvent(eventType: RecordingBookSelectorEventType, payload?: any) {
    const event: EventInfo = {
      type: eventType,
      payload
    };

    this.recordingBookSelectorEvent.emit(event);
  }

}
