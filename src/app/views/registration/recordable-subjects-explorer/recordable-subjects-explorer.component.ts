/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { EmptyRecordableSubject, RecordableSubject } from '@app/models';

import {
  RecordableSubjectsViewerEventType
} from '../recordable-subjects-viewer/recordable-subjects-viewer.component';


@Component({
  selector: 'emp-land-recordable-subjects-explorer',
  templateUrl: './recordable-subjects-explorer.component.html',
})
export class RecordableSubjectsExplorerComponent {

  displayRecordableSubjectsViewer = false;

  selectedRecordableSubject: RecordableSubject = EmptyRecordableSubject;

  onSelectedRecordableSubject(event: EventInfo) {
    switch (event.type as RecordableSubjectsViewerEventType) {
      case RecordableSubjectsViewerEventType.SELECT_RECORDABLE_SUBJECT:
        Assertion.assertValue(event.payload.recordableSubject, 'event.payload.recordableSubject');
        this.selectedRecordableSubject = event.payload.recordableSubject as RecordableSubject;
        // this.displayRecordableSubjectsViewer = true;
        return;

      case RecordableSubjectsViewerEventType.UNSELECT_RECORDABLE_SUBJECT:
        this.onCloseRecordableSubjectViewer();
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onCloseRecordableSubjectViewer() {
    this.displayRecordableSubjectsViewer = false;
    this.selectedRecordableSubject = EmptyRecordableSubject;
  }

}
