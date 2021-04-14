/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { EventInfo, Identifiable } from '@app/core';
import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';
import { BookEntryShortModel, RecorderOffice } from '@app/models';
import { RecordableSubjectsStateSelector,
  RegistrationAction,
         TransactionStateSelector } from '@app/presentation/exported.presentation.types';
import { concat, Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs/operators';


@Component({
  selector: 'emp-land-recording-book-selector',
  templateUrl: './recording-book-selector.component.html',
})
export class RecordingBookSelectorComponent implements OnInit, OnDestroy {

  @Input() showRecordingBookEntryField: boolean;

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
        this.uiLayer.dispatch(RegistrationAction.SELECT_RECORDING_BOOK,
                             { recordingBookUID: this.recordingBookSelected.uid });
    }
  }


  onRecordingBookEntryClicked(){
    if (this.recordingBookEntrySelected) {
        this.uiLayer.dispatch(RegistrationAction.SELECT_BOOK_ENTRY,
                              { bookEntry: this.recordingBookEntrySelected });
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

    this.helper.select<BookEntryShortModel[]>(RecordableSubjectsStateSelector.RECORDING_BOOK_ENTRIES_LIST,
                                       { recordingBookUID: this.recordingBookSelected?.uid })
      .toPromise()
      .then(x => {
        this.recordingBookEntryList = x;
        this.isLoading = false;
      });
  }

}
