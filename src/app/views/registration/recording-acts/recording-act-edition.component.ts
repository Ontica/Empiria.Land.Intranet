/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Assertion } from '@app/core';
import { RecordingDataService } from '@app/data-services';

import { EmptyRecordingAct, RecordingAct, RecordingActFields } from '@app/models';
import { RecordingActEditorEventType } from './recording-act-editor.component';

@Component({
  selector: 'emp-land-recording-act-edition',
  templateUrl: './recording-act-edition.component.html',
  styles: [
  ]
})
export class RecordingActEditionComponent implements OnInit, OnChanges {

  @Input() instrumentRecordingUID: string;

  @Input() recordingActUID: string;

  @Output() closeEvent = new EventEmitter<void>();

  recordingAct: RecordingAct = EmptyRecordingAct;

  cardHint: string;

  submitted = false;

  isLoading = false;


  constructor(private recordingData: RecordingDataService) { }

  ngOnChanges() {
    this.loadRecordingAct();
  }


  ngOnInit(): void {
  }


  onClose() {
    this.closeEvent.emit();
  }


  onRecordingActEditorEvent(event) {
    switch (event.type as RecordingActEditorEventType) {

      case RecordingActEditorEventType.UPDATE_RECORDING_ACT:

        Assertion.assertValue(event.payload.recordingActFields, 'event.payload.recordingActFields');

        this.updateRecordingAct(event.payload.recordingActFields as RecordingActFields);

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private loadRecordingAct() {
    if (!this.instrumentRecordingUID || !this.recordingActUID) {
      this.recordingAct = EmptyRecordingAct;
      this.initTexts();

      return;
    }

    this.setSubmitted(true);

    this.recordingData.getRecordingAct(this.instrumentRecordingUID, this.recordingActUID)
      .toPromise()
      .then(x => {
        this.recordingAct = x;
        this.initTexts();
      })
      .finally(() => this.setSubmitted(false));
  }


  private updateRecordingAct(recordingActFields: RecordingActFields) {
    this.setSubmitted(true);

    this.recordingData.updateRecordingAct(this.instrumentRecordingUID,
                                          this.recordingActUID,
                                          recordingActFields)
      .toPromise()
      .then(x => {
        this.recordingAct = x;
        this.initTexts();
      })
      .finally(() => this.setSubmitted(false));
  }


  private initTexts() {
    this.cardHint = `<strong>${this.recordingAct.name} &nbsp; &nbsp; | &nbsp; &nbsp;
      ${this.recordingAct.recordableSubject.uid}</strong>`;
  }


  private setSubmitted(submitted: boolean) {
    this.isLoading = submitted;
    this.submitted = submitted;
  }

}
