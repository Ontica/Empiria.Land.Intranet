/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { sendEvent } from '@app/shared/utils';

import { RecordingDataService } from '@app/data-services';

import { EmptyRegistryEntryData, EmptyTractIndex, RealEstate, RecordableSubjectType, RegistryEntryData,
         TractIndex } from '@app/models';

import { RecordableSubjectEditorEventType } from '../recordable-subject/recordable-subject-editor.component';

import {
  RecordableSubjectHistoryEventType
} from '../recordable-subject/recordable-subject-history.component';

import { RecordingActEditionEventType } from '../recording-acts/recording-act-edition.component';

export enum RegistryEntryEditorEventType {
  RECORDABLE_SUBJECT_UPDATED = 'RegistryEntryEditorComponent.Event.RecordableSubjectUpdated',
  RECORDING_ACT_UPDATED      = 'RegistryEntryEditorComponent.Event.RecordingActUpdated',
  CLOSE_BUTTON_CLICKED       = 'RegistryEntryEditorComponent.Event.CloseButtonClicked',
}


@Component({
  selector: 'emp-land-registry-entry-editor',
  templateUrl: './registry-entry-editor.component.html',
})
export class  RegistryEntryEditorComponent implements OnChanges, OnDestroy {

  @Input() data: RegistryEntryData = EmptyRegistryEntryData;

  @Input() cardFloatingEffect = false;

  @Output() registryEntryEditorEvent = new EventEmitter<EventInfo>();

  tractIndex: TractIndex = EmptyTractIndex;

  cardTitle = 'Editor...';

  tabEditorLabel = 'Datos';

  isLoading = false;

  helper: SubscriptionHelper;


  constructor(private uiLayer: PresentationLayer,
              private recordingDataService: RecordingDataService) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnChanges() {
    this.getTractIndex();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get displayRecordingAct(): boolean {
    return this.data.view === 'RecordingAct';
  }


  get isRealEstate() {
    return this.tractIndex.recordableSubject.type === RecordableSubjectType.RealEstate;
  }


  get isAssociation() {
    return this.tractIndex.recordableSubject.type === RecordableSubjectType.Association;
  }


  get isNoProperty() {
    return this.tractIndex.recordableSubject.type === RecordableSubjectType.NoProperty;
  }


  get realEstate(): RealEstate {
    return this.tractIndex.recordableSubject as RealEstate;
  }


  onClose() {
    sendEvent(this.registryEntryEditorEvent, RegistryEntryEditorEventType.CLOSE_BUTTON_CLICKED);
  }


  onRecordingActEditionEventType(event: EventInfo) {
    switch (event.type as RecordingActEditionEventType) {

      case RecordingActEditionEventType.RECORDING_ACT_UPDATED:
        sendEvent(this.registryEntryEditorEvent, RegistryEntryEditorEventType.RECORDING_ACT_UPDATED);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onRecordableSubjectEditorEvent(event: EventInfo) {
    switch (event.type as RecordableSubjectEditorEventType) {
      case RecordableSubjectEditorEventType.RECORDABLE_SUBJECT_UPDATED:
        Assertion.assertValue(event.payload.instrumentRecording, 'event.payload.instrumentRecording');
        this.refreshTractIndex();
        sendEvent(this.registryEntryEditorEvent, RegistryEntryEditorEventType.RECORDABLE_SUBJECT_UPDATED,
          event.payload)
        return;

      default:
        throw Assertion.assertNoReachThisCode(`Unrecoginzed event ${event.type}.`);
    }
  }


  onRecordableSubjectHistoryEvent(event: EventInfo) {
    switch (event.type as RecordableSubjectHistoryEventType) {
      case RecordableSubjectHistoryEventType.TRACT_INDEX_UPDATED:
        Assertion.assertValue(event.payload.tractIndex, 'event.payload.tractIndex');
        this.setTractIndex(event.payload.tractIndex as TractIndex);
        return;

      case RecordableSubjectHistoryEventType.TRACT_INDEX_REFRESH:
        this.refreshTractIndex();
        return;

      default:
        throw Assertion.assertNoReachThisCode(`Unrecoginzed event ${event.type}.`);
    }
  }


  private getTractIndex() {
    if (!this.data.instrumentRecordingUID || !this.data.recordingActUID) {
      this.setTractIndex(EmptyTractIndex);
      return;
    }

    this.isLoading = true;

    this.recordingDataService.getTractIndex(this.data.instrumentRecordingUID,
                                            this.data.recordingActUID)
      .toPromise()
      .then(x => this.setTractIndex(x))
      .catch(() => this.onClose())
      .finally(() => this.isLoading = false);
  }


  private refreshTractIndex() {
    this.getTractIndex();
  }


  private setTractIndex(tractIndex: TractIndex) {
    this.tractIndex = tractIndex;
    this.initTexts();
  }


  private initTexts(){
    this.cardTitle = this.displayRecordingAct ? 'Editor del acto jurídico' : 'Editor ';
    this.tabEditorLabel = 'Datos ';

    if (this.isRealEstate) {
      this.cardTitle += this.displayRecordingAct ? '' : 'del predio';
      this.tabEditorLabel += 'del predio';
    }

    if (this.isAssociation) {
      this.cardTitle += this.displayRecordingAct ? '' : 'de la asociación';
      this.tabEditorLabel += 'de la asociación';
    }

    if (this.isNoProperty) {
      this.cardTitle += this.displayRecordingAct ? '' : 'del documento';
      this.tabEditorLabel += 'del documento';
    }
  }

}
