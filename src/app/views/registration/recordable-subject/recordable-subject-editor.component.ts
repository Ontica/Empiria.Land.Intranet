/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';

import { Assertion, Command, EventInfo } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { RegistrationCommandType } from '@app/presentation/exported.presentation.types';

import { sendEvent } from '@app/shared/utils';

import { InstrumentRecording, RealEstate, RecordableSubject, RecordableSubjectFields,
         RecordableSubjectType } from '@app/models';

import {
  NoPropertyEditorComponentEventType
} from '@app/views/recordable-subjects/no-property/no-property-editor.component';

import {
  RealEstateEditorComponentEventType
} from '@app/views/recordable-subjects/real-estate/real-estate-editor.component';

export enum RecordableSubjectEditorEventType {
  RECORDABLE_SUBJECT_UPDATED = 'RecordableSubjectEditorComponent.Event.RecordableSubjectUpdated',
}


@Component({
  selector: 'emp-land-recordable-subject-editor',
  templateUrl: './recordable-subject-editor.component.html',
})
export class RecordableSubjectEditorComponent implements OnDestroy {

  @Input() instrumentRecordingUID = '';

  @Input() recordingActUID = '';

  @Input() recordableSubject: RecordableSubject;

  @Input() readonly = true;

  @Output() recordableSubjectEditorEvent = new EventEmitter<EventInfo>();

  helper: SubscriptionHelper;

  submitted = false;

  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get isRealEstate() {
    return this.recordableSubject.type === RecordableSubjectType.RealEstate;
  }


  get isAssociation() {
    return this.recordableSubject.type === RecordableSubjectType.Association;
  }


  get isNoProperty() {
    return this.recordableSubject.type === RecordableSubjectType.NoProperty;
  }


  get realEstate(): RealEstate {
    return this.recordableSubject as RealEstate;
  }


  onRealEstateEditorEvent(event) {
    if (this.submitted) {
      return;
    }

    switch (event.type as RealEstateEditorComponentEventType) {
      case RealEstateEditorComponentEventType.UPDATE_REAL_ESTATE:
        Assertion.assertValue(event.payload.instrumentRecordingUID, 'event.payload.instrumentRecordingUID');
        Assertion.assertValue(event.payload.recordingActUID, 'event.payload.recordingActUID');
        Assertion.assertValue(event.payload.recordableSubjectFields, 'event.payload.recordableSubjectFields');
        this.updateRecordableSubject(event.payload.instrumentRecordingUID,
                                     event.payload.recordingActUID,
                                     event.payload.recordableSubjectFields);
        return;

      default:
        throw Assertion.assertNoReachThisCode(`Unrecoginzed event ${event.type}.`);
    }
  }


  onNoPropertyEditorEvent(event) {
    if (this.submitted) {
      return;
    }

    switch (event.type as NoPropertyEditorComponentEventType) {
      case NoPropertyEditorComponentEventType.UPDATE_NO_PROPERTY:
        Assertion.assertValue(event.payload.instrumentRecordingUID, 'event.payload.instrumentRecordingUID');
        Assertion.assertValue(event.payload.recordingActUID, 'event.payload.recordingActUID');
        Assertion.assertValue(event.payload.recordableSubjectFields, 'event.payload.recordableSubjectFields');
        this.updateRecordableSubject(event.payload.instrumentRecordingUID,
                                     event.payload.recordingActUID,
                                     event.payload.recordableSubjectFields);
        return;

      default:
        throw Assertion.assertNoReachThisCode(`Unrecoginzed event ${event.type}.`);
    }
  }


  private updateRecordableSubject(instrumentRecordingUID: string,
                                  recordingActUID: string,
                                  recordableSubjectFields: RecordableSubjectFields) {
    this.submitted = true;

    const command: Command = {
      type: RegistrationCommandType.UPDATE_RECORDABLE_SUBJECT,
      payload: {
        instrumentRecordingUID,
        recordingActUID,
        recordableSubjectFields,
      },
    };

    return this.uiLayer.execute<InstrumentRecording>(command)
      .then(instrumentRecording =>
        sendEvent(this.recordableSubjectEditorEvent,
          RecordableSubjectEditorEventType.RECORDABLE_SUBJECT_UPDATED, {instrumentRecording})
      )
      .finally(() => this.submitted = false);
  }

}
