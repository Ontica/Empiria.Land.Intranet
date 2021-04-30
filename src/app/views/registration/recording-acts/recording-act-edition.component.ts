/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

import { Assertion } from '@app/core';

import { RecordingDataService } from '@app/data-services';

import { EmptyRecordingAct, EmptyRecordingActParty, RecordingAct, RecordingActFields,
         RecordingActParty } from '@app/models';

import { PartyEditorEventType } from '@app/views/recordable-subjects/parties/party-editor.component';

import { PartyListEventType } from '@app/views/recordable-subjects/parties/party-list.component';

import { RecordingActEditorEventType } from './recording-act-editor.component';

@Component({
  selector: 'emp-land-recording-act-edition',
  templateUrl: './recording-act-edition.component.html',
})
export class RecordingActEditionComponent implements OnInit, OnChanges {

  @Input() instrumentRecordingUID: string;

  @Input() recordingActUID: string;

  @Output() closeEvent = new EventEmitter<void>();

  recordingAct: RecordingAct = EmptyRecordingAct;

  cardHint: string;

  submitted = false;

  isLoading = false;

  panelAddState = false;

  partySelected: RecordingActParty = EmptyRecordingActParty;


  constructor(private recordingData: RecordingDataService) { }

  ngOnChanges() {
    this.loadRecordingAct();
    this.resetPanelState(false);
  }


  ngOnInit(): void {
  }


  onClose() {
    this.closeEvent.emit();
  }


  onPanelEstateChange(state) {
    this.resetPanelState(state);
    this.partySelected = EmptyRecordingActParty;
    this.partySelected.party.fullName = '';
  }


  onPartySelectedChange(recordingActParty: RecordingActParty) {
    this.partySelected = null;
    setTimeout(() => this.partySelected = recordingActParty );
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


  onPartyListEvent(event) {
    switch (event.type as PartyListEventType) {

      case PartyListEventType.REMOVE_PARTY:

        Assertion.assertValue(event.payload.partyUID, 'event.payload.partyUID');

        const payload = {
          instrumentRecordingUID: this.instrumentRecordingUID,
          recordingActUID: this.recordingActUID,
          partyUID: event.payload.partyUID,
        };

        console.log(payload);

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onPartyEditorEvent(event) {
    switch (event.type as PartyEditorEventType) {

      case PartyEditorEventType.ADD_PARTY:

        Assertion.assertValue(event.payload.party, 'event.payload.party');

        const payload = {
          instrumentRecordingUID: this.instrumentRecordingUID,
          recordingActUID: this.recordingActUID,
          party: event.payload.party,
        };

        console.log(payload);

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

  private resetPanelState(state) {
    this.panelAddState = state;
  }

}
