/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { RegistrationStateSelector } from '@app/presentation/exported.presentation.types';

import { sendEvent } from '@app/shared/utils';

import { RecordingDataService } from '@app/data-services';

import { EmptyRecordableSubject, RecordableSubject, RecordingActTypeGroup,
         RegistrationCommand } from '@app/models';


import { RecordingActCreatorEventType } from './recording-act-creator.component';


export enum RecordingActCreatorModalEventType {
  CLOSE_MODAL_CLICKED  = 'RecordingActCreatorModalComponent.Event.CloseModalClicked',
  RECORDING_ACT_CREATED = 'RecordingActCreatorModalComponent.Event.RecordingActCreated',
}


@Component({
  selector: 'emp-land-recording-act-creator-modal',
  templateUrl: './recording-act-creator-modal.component.html',
})
export class RecordingActCreatorModalComponent implements OnInit, OnDestroy {

  @Input() recordableSubject: RecordableSubject = EmptyRecordableSubject;

  @Output() recordingActCreatorModalEvent = new EventEmitter<EventInfo>();

  title = 'Agregar un acto jurídico a la historia registral';

  hint = '';

  submitted = false;

  recordingActTypeGroupList: RecordingActTypeGroup[] = [];

  helper: SubscriptionHelper;

  constructor(private uiLayer: PresentationLayer,
              private recordingData: RecordingDataService) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit() {
    this.getRecordingActTypeGroup();
    this.setHintText();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  onClose() {
    sendEvent(this.recordingActCreatorModalEvent, RecordingActCreatorModalEventType.CLOSE_MODAL_CLICKED);
  }


  onRecordingActCreatorEvent(event: EventInfo) {
    switch (event.type as RecordingActCreatorEventType) {

      case RecordingActCreatorEventType.APPEND_RECORDING_ACT:
        Assertion.assertValue(event.payload.recordableSubjectUID, 'event.payload.recordableSubjectUID');
        Assertion.assertValue(event.payload.registrationCommand, 'event.payload.registrationCommand');
        this.createRecordingActInTractIndex(event.payload.recordableSubjectUID,
          event.payload.registrationCommand as RegistrationCommand);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private getRecordingActTypeGroup() {
    this.helper.select<RecordingActTypeGroup[]>(
      RegistrationStateSelector.RECORDING_ACT_TYPES_LIST_FOR_RECORDABLE_SUBJECT,
      { recordableSubjectUID: this.recordableSubject.uid })
      .firstValue()
      .then(x => this.recordingActTypeGroupList = x);
  }


  private createRecordingActInTractIndex(recordableSubjectUID: string, command: RegistrationCommand) {
    this.submitted = true;

    this.recordingData.createRecordingActInTractIndex(recordableSubjectUID, command)
      .firstValue()
      .then(x =>
        sendEvent(this.recordingActCreatorModalEvent, RecordingActCreatorModalEventType.RECORDING_ACT_CREATED,
          {tractIndex: x})
      )
      .finally(() => this.submitted = false);
  }


  private setHintText() {
    this.hint = this.recordableSubject.electronicID;
  }

}
