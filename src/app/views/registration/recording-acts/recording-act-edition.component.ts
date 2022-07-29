/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { RecordingDataService } from '@app/data-services';

import { sendEvent } from '@app/shared/utils';

import { EmptyParty, EmptyRecordingAct, Party, RecordingAct, RecordingActFields,
         RecordingActPartyFields} from '@app/models';

import { PartyEditorEventType } from '@app/views/recordable-subjects/parties/party-editor.component';

import { PartyListEventType } from '@app/views/recordable-subjects/parties/party-list.component';

import { RecordingActEditorEventType } from './recording-act-editor.component';

export enum RecordingActEditionEventType {
  CLOSE_BUTTON_CLICKED  = 'RecordingActEditionComponent.Event.CloseButtonClicked',
  RECORDING_ACT_UPDATED = 'RecordingActEditionComponent.Event.RecordingActUpdated',
}

@Component({
  selector: 'emp-land-recording-act-edition',
  templateUrl: './recording-act-edition.component.html',
})
export class RecordingActEditionComponent implements OnChanges {

  @Input() instrumentRecordingUID: string;

  @Input() recordingActUID: string;

  @Input() readonly = false;

  @Input() displayFlat = false;

  @Output() recordingActEditionEventType = new EventEmitter<EventInfo>();

  recordingAct: RecordingAct = EmptyRecordingAct;

  cardHint: string;

  submitted = false;

  isLoading = false;

  panelAddState = false;

  partySelected: Party = EmptyParty;

  primaryPartyList: Party[] = [];


  constructor(private recordingData: RecordingDataService) { }

  ngOnChanges() {
    this.getRecordingAct();
    this.resetPanelState(false);
  }


  onClose() {
    sendEvent(this.recordingActEditionEventType, RecordingActEditionEventType.CLOSE_BUTTON_CLICKED);
  }


  onPanelEstateChange(state) {
    this.resetPanelState(state);
    this.partySelected = EmptyParty;
  }


  onPartySelectedChange(party: Party) {
    this.partySelected = party;
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

        this.removeRecordingActParty(event.payload.partyUID as string);

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

        this.appendRecordingActParty(event.payload.party as RecordingActPartyFields);

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private getRecordingAct() {
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
        this.setPrimaryPartyList();
        this.initTexts();
      })
      .catch(() => this.onClose())
      .finally(() => this.setSubmitted(false));
  }


  private setPrimaryPartyList() {
    this.primaryPartyList = this.recordingAct.parties.filter(x => x.type === 'Primary').map(x => x.party);
  }


  private updateRecordingAct(recordingActFields: RecordingActFields) {
    this.setSubmitted(true);

    this.recordingData.updateRecordingAct(this.instrumentRecordingUID,
                                          this.recordingActUID,
                                          recordingActFields)
      .toPromise()
      .then(x => {
        this.emitRecordingActUpdated();
        this.recordingAct = x;
        this.setPrimaryPartyList();
        this.initTexts();
      })
      .finally(() => this.setSubmitted(false));
  }


  private emitRecordingActUpdated() {
    if (this.recordingAct.actions.editableFields.includes('RecordingActType')) {
      sendEvent(this.recordingActEditionEventType, RecordingActEditionEventType.RECORDING_ACT_UPDATED);
    }
  }


  private appendRecordingActParty(recordingActPartyFields: RecordingActPartyFields) {
    this.setSubmitted(true);

    this.recordingData.appendRecordingActParty(this.instrumentRecordingUID,
                                               this.recordingActUID,
                                               recordingActPartyFields)
      .toPromise()
      .then(x => {
        this.recordingAct = x;
        this.setPrimaryPartyList();
        this.resetPanelState(false);
      })
      .finally(() => this.setSubmitted(false));
  }


  private removeRecordingActParty(recordingActPartyUID: string) {
    this.setSubmitted(true);

    this.recordingData.removeRecordingActParty(this.instrumentRecordingUID,
                                               this.recordingActUID,
                                               recordingActPartyUID)
      .toPromise()
      .then(x => {
        this.recordingAct = x;
        this.setPrimaryPartyList();
        this.resetPanelState(false);
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


  private resetPanelState(open) {
    this.panelAddState = open;
  }

}
