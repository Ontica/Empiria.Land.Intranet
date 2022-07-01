/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { EmptyTractIndex, EmptyTractIndexEntry, getRecordableSubjectTypeName, TractIndex,
         TractIndexEntry } from '@app/models';

import { TractIndexEntriesViewerEventType } from './tract-index-entries-viewer.component';


@Component({
  selector: 'emp-land-tract-index-explorer',
  templateUrl: './tract-index-explorer.component.html',
  styles: [`
    .margin-auto {
      margin: auto;
    }`
  ],
})
export class TractIndexExplorerComponent implements OnInit {

  @Input() tractIndex: TractIndex = EmptyTractIndex;

  @Output() closeEvent = new EventEmitter<void>();

  title = 'Explorador de tracto jurídico';

  hint = '';

  isLoading = false;

  displayTractIndexEntry = false;

  selectedTractIndexEntry: TractIndexEntry = EmptyTractIndexEntry;


  ngOnInit() {
    this.initTexts();
  }


  onClose() {
    this.closeEvent.emit();
  }


  onTractIndexEntriesViewerEvent(event: EventInfo) {
    switch (event.type as TractIndexEntriesViewerEventType) {

      case TractIndexEntriesViewerEventType.SELECT_TRACT_INDEX_ENTRY:
        Assertion.assertValue(event.payload.tractIndexEntry, 'event.payload.tractIndexEntry');
        Assertion.assertValue(event.payload.tractIndexEntry.instrumentRecordingUID,
          'event.payload.tractIndexEntry.instrumentRecordingUID');
        Assertion.assertValue(event.payload.tractIndexEntry.uid, 'event.payload.tractIndexEntry.uid');

        this.selectedTractIndexEntry = event.payload.tractIndexEntry as TractIndexEntry;
        this.displayTractIndexEntry = !isEmpty(this.selectedTractIndexEntry);
        return;

      case TractIndexEntriesViewerEventType.UNSELECT_TRACT_INDEX_ENTRY:
        this.onCloseTractIndexEntryTabbed();
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onCloseTractIndexEntryTabbed() {
    this.displayTractIndexEntry = false;
    this.selectedTractIndexEntry = EmptyTractIndexEntry;
  }


  private initTexts(){
    this.title = 'Explorador de tracto jurídico';

    this.hint = `<strong>${this.tractIndex.recordableSubject.electronicID}</strong>` +
      `&nbsp; &nbsp; | &nbsp; &nbsp; <strong>${this.tractIndex.recordableSubject.recorderOffice.name}</strong>` +
      `&nbsp; &nbsp; | &nbsp; &nbsp; <strong>${getRecordableSubjectTypeName(this.tractIndex.recordableSubject.type)}</strong>` +
      `&nbsp; &nbsp; | &nbsp; &nbsp; ${this.tractIndex.recordableSubject.kind}` +
      `&nbsp; &nbsp; | &nbsp; &nbsp; ${this.tractIndex.recordableSubject.status}`;
  }

}
