/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { EventInfo, Identifiable } from '@app/core';
import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';
import { RecorderOffice } from '@app/models';
import { RecordableSubjectsStateSelector,
         TransactionStateSelector } from '@app/presentation/exported.presentation.types';
import { FormHandler } from '@app/shared/utils';
import { concat, Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs/operators';

enum RecordingBookSelectorFormControls {
  recorderOfficeUID = 'recorderOfficeUID',
  recordingSectionUID = 'recordingSectionUID',
  recordingBookUID = 'recordingBookUID',
  recordingBookEntryUID = 'recordingBookEntryUID',
}

export enum RecordingBookSelectorEventType {
  RECORDING_BOOK_SELECTED = 'RecordingBookSelectorComponent.Event.RecordingBookSelected',
  RECORDING_BOOK_CLICKED = 'RecordingBookSelectorComponent.Event.RecordingBookClicked',
  RECORDING_BOOK_ENTRY_SELECTED = 'RecordingBookSelectorComponent.Event.RecordingBookEntryClicked',
}

@Component({
  selector: 'emp-land-recording-book-selector',
  templateUrl: './recording-book-selector.component.html',
})
export class RecordingBookSelectorComponent implements OnInit, OnDestroy {

  @Input() showRecordingBookEntryField: boolean;

  @Output() recordingBookSelectorEvent = new EventEmitter<EventInfo>();

  helper: SubscriptionHelper;

  formHandler: FormHandler;
  controls = RecordingBookSelectorFormControls;

  isLoading = false;

  recorderOfficeList: Identifiable[] = [];
  recordingSectionList: Identifiable[] = [];

  recordingBookList$: Observable<Identifiable[]>;
  recordingBookInput$ = new Subject<string>();
  recordingBookLoading = false;
  recordingBookMinTermLength = 3;

  recordingBookEntryList: Identifiable[] = [];

  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
  }

  ngOnInit(): void {
    this.initForm();
    this.initLoad();
    this.validateEnableRecordingBookField();
  }

  ngOnDestroy() {
    this.helper.destroy();
  }

  get isReadyToFilterRecordingBook(){
    return this.formHandler.getControl(this.controls.recorderOfficeUID).value &&
      this.formHandler.getControl(this.controls.recordingSectionUID).value;
  }


  onRecorderOfficeChange(recorderOffice: RecorderOffice){
    this.validateEnableRecordingBookField();
  }


  onRecordingSectionChange(recordingSection: Identifiable) {
    this.validateEnableRecordingBookField();
  }


  onRecordingBookChange(recordingBook: Identifiable) {
    this.resetAndDisableRecordingBookEntries();
    this.loadRecordingBookEntryList(recordingBook?.uid);

    if (!this.showRecordingBookEntryField && recordingBook) {
      this.sendEvent(RecordingBookSelectorEventType.RECORDING_BOOK_SELECTED, this.getFormData());
    }
  }


  onRecordingBookEntryChange(recordingBookEntry: Identifiable) {
    if (recordingBookEntry) {
      this.sendEvent(RecordingBookSelectorEventType.RECORDING_BOOK_SELECTED, this.getFormData());
    }
  }


  onRecordingBookClicked(){
    if (this.formHandler.getControl(this.controls.recordingBookUID).value) {
      this.sendEvent(RecordingBookSelectorEventType.RECORDING_BOOK_CLICKED,
        {recordingBookUID : this.formHandler.getControl(this.controls.recordingBookUID).value});
    }
  }


  onRecordingBookEntryClicked(){
    if (this.formHandler.getControl(this.controls.recordingBookEntryUID).value) {
      this.sendEvent(RecordingBookSelectorEventType.RECORDING_BOOK_ENTRY_SELECTED,
        {recordingBookEntryUID : this.formHandler.getControl(this.controls.recordingBookEntryUID).value});
    }
  }


  private initForm() {
    this.formHandler = new FormHandler(
      new FormGroup({
        recorderOfficeUID: new FormControl(''),
        recordingSectionUID: new FormControl(''),
        recordingBookUID: new FormControl(''),
        recordingBookEntryUID: new FormControl(''),
      })
    );
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


  private validateEnableRecordingBookField(){
    this.formHandler.getControl(this.controls.recordingBookUID).reset();
    this.formHandler.disableControl(this.controls.recordingBookUID, !this.isReadyToFilterRecordingBook);
    this.subscribeRecordingBookList();

    this.resetAndDisableRecordingBookEntries();
  }


  private resetAndDisableRecordingBookEntries(){
    this.formHandler.getControl(this.controls.recordingBookEntryUID).reset();
    this.formHandler.disableControl(this.controls.recordingBookEntryUID, !this.isReadyToFilterRecordingBook);
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
      recorderOfficeUID: this.formHandler.getControl(this.controls.recorderOfficeUID).value,
      recordingSectionUID: this.formHandler.getControl(this.controls.recordingSectionUID).value,
      keywords
    };

    return recordingBookFilter;
  }


  private loadRecordingBookEntryList(recordingBookUID: string) {

    if (!this.showRecordingBookEntryField) {
      return;
    }

    if (!recordingBookUID) {
      this.recordingBookEntryList = [];
      return;
    }

    this.isLoading = true;

    this.helper.select<Identifiable[]>(RecordableSubjectsStateSelector.RECORDING_BOOK_ENTRIES_LIST,
                                        { recordingBookUID })
      .toPromise()
      .then(x => {
        this.recordingBookEntryList = x;
        this.isLoading = false;
      });
  }


  private getFormData(){
    const formModel = this.formHandler.form.getRawValue();

    const data: any = {
      recorderOfficeUID: formModel.recorderOfficeUID ?? '',
      recordingSectionUID: formModel.recordingSectionUID ?? '',
      recordingBookUID: formModel.recordingBookUID ?? '',
      recordingBookEntryUID: formModel.recordingBookEntryUID ?? '',
    };

    return data;
  }


  private sendEvent(eventType: RecordingBookSelectorEventType, payload?: any) {
    const event: EventInfo = {
      type: eventType,
      payload
    };

    this.recordingBookSelectorEvent.emit(event);

    console.log(event);
  }

}
