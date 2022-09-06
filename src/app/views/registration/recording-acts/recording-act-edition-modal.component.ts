/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { RecordingActTypeGroup } from '@app/models';

import { RecordingActEditionEventType } from './recording-act-edition.component';


export enum RecordingActEditionModalEventType {
  CLOSE_MODAL_CLICKED  = 'RecordingActEditionModalComponent.Event.CloseModalClicked',
  RECORDING_ACT_UPDATED = 'RecordingActEditionModalComponent.Event.RecordingActUpdated',
}


@Component({
  selector: 'emp-land-recording-act-edition-modal',
  templateUrl: './recording-act-edition-modal.component.html',
})
export class RecordingActEditionModalComponent  {

  @Input() instrumentRecordingUID = '';

  @Input() recordingActUID = '';

  @Input() readonly = true;

  @Output() recordingActEditionModalEvent = new EventEmitter<EventInfo>();

  title = 'Agregar un acto jurídico al tracto';

  hint = '';

  submitted = false;

  recordingActTypeGroupList: RecordingActTypeGroup[] = [];


  onRecordingActEditionEventType(event: EventInfo) {
    switch (event.type as RecordingActEditionEventType) {

      case RecordingActEditionEventType.CLOSE_BUTTON_CLICKED:
        sendEvent(this.recordingActEditionModalEvent, RecordingActEditionModalEventType.CLOSE_MODAL_CLICKED);
        return;

      case RecordingActEditionEventType.RECORDING_ACT_UPDATED:
        sendEvent(this.recordingActEditionModalEvent, RecordingActEditionModalEventType.RECORDING_ACT_UPDATED);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }

}
