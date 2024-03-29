/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { isRecordableSubjectType, RecordableSubjectQueryResult, RecordingActPartyQueryResult,
         RecordSearchResult, RecordSearchType } from '@app/models';

import { sendEvent } from '@app/shared/utils';

import {
  RecordableSubjectViewEventType
} from '@app/views/land-controls/recordable-subject/recordable-subject-view.component';

export enum RecordSearchListItemEventType {
  RECORDABLE_SUBJECT_CLICKED = 'RecordSearchListItemComponent.Event.RecordableSubjectClicked',
  CADASTRAL_CLICKED          = 'RecordSearchListItemComponent.Event.CadastralClicked',
  RECORD_CLICKED             = 'RecordSearchListItemComponent.Event.RecordClicked',
  TRANSACTION_CLICKED        = 'RecordSearchListItemComponent.Event.TransactionClicked',
}


@Component({
  selector: 'emp-land-record-search-list-item',
  templateUrl: './record-search-list-item.component.html',
})
export class RecordSearchListItemComponent {

  @Input() recordSearchType: string;

  @Input() record: RecordSearchResult;

  @Output() recordSearchListItemEvent = new EventEmitter<EventInfo>();


  get isSearchTypeByRecordableSubject(): boolean {
    return isRecordableSubjectType(this.recordSearchType);
  }


  get isSearchTypeByParty(): boolean {
    return RecordSearchType.Party === this.recordSearchType;
  }


  get item(): RecordableSubjectQueryResult {
    return this.record as RecordableSubjectQueryResult;
  }


  get party(): RecordingActPartyQueryResult {
    return this.record as RecordingActPartyQueryResult;
  }


  get relatedParties() {
    return [];
  }


  onRecordableSubjectViewEvent(event: EventInfo) {
    switch (event.type as RecordableSubjectViewEventType) {
      case RecordableSubjectViewEventType.RECORDABLE_SUBJECT_CLICKED:
        sendEvent(this.recordSearchListItemEvent,
          RecordSearchListItemEventType.RECORDABLE_SUBJECT_CLICKED, {record: this.record});
        return;

      case RecordableSubjectViewEventType.CADASTRAL_CLICKED:
        sendEvent(this.recordSearchListItemEvent,
          RecordSearchListItemEventType.CADASTRAL_CLICKED, {record: this.record});
        break;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onRecordClicked() {
    sendEvent(this.recordSearchListItemEvent,
      RecordSearchListItemEventType.RECORD_CLICKED, {record: this.record});
  }


  onTransactionClicked() {
    sendEvent(this.recordSearchListItemEvent,
      RecordSearchListItemEventType.TRANSACTION_CLICKED, {record: this.record});
  }

}
