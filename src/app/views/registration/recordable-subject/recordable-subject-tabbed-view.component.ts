/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { sendEvent } from '@app/shared/utils';

import { RecordingDataService } from '@app/data-services';

import { EmptyTractIndex, RealEstate, RecordableSubjectType, TractIndex } from '@app/models';

import { RecordableSubjectEditorEventType } from '../recordable-subject/recordable-subject-editor.component';

import { RecordableSubjectHistoryEventType } from './recordable-subject-history.component';

export enum RecordableSubjectTabbedViewEventType {
  RECORDABLE_SUBJECT_UPDATED = 'RecordableSubjectTabbedViewComponent.Event.RecordableSubjectUpdated',
  CLOSE_BUTTON_CLICKED       = 'RecordableSubjectTabbedViewComponent.Event.CloseButtonClicked',
}


@Component({
  selector: 'emp-land-recordable-subject-tabbed-view',
  templateUrl: './recordable-subject-tabbed-view.component.html',
})
export class RecordableSubjectTabbedViewComponent implements OnChanges, OnDestroy {

  @Input() instrumentRecordingUID: string;

  @Input() recordingActUID: string;

  @Input() canEditRecordableSubject = false;

  @Input() canEditTractIndex = false;

  @Output() recordableSubjectTabbedViewEvent = new EventEmitter<EventInfo>();

  tractIndex: TractIndex = EmptyTractIndex;

  helper: SubscriptionHelper;

  cardTitle = 'Visor y editor';

  cardHint: string;

  isLoading = false;

  tabEditorLabel = 'Datos del predio';

  constructor(private uiLayer: PresentationLayer, private recordingDataService: RecordingDataService) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.instrumentRecordingUID && changes.recordingActUID) {
      this.getTractIndex();
    }
  }


  ngOnDestroy() {
    this.helper.destroy();
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
    sendEvent(this.recordableSubjectTabbedViewEvent,
      RecordableSubjectTabbedViewEventType.CLOSE_BUTTON_CLICKED);
  }


  onRecordableSubjectEditorEvent(event: EventInfo) {
    switch (event.type as RecordableSubjectEditorEventType) {
      case RecordableSubjectEditorEventType.RECORDABLE_SUBJECT_UPDATED:
        Assertion.assertValue(event.payload.instrumentRecording, 'event.payload.instrumentRecording');
        this.refreshTractIndex();
        sendEvent(this.recordableSubjectTabbedViewEvent,
          RecordableSubjectTabbedViewEventType.RECORDABLE_SUBJECT_UPDATED, event.payload)
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
    if (!this.instrumentRecordingUID || !this.recordingActUID) {
      this.setTractIndex(EmptyTractIndex);
      return;
    }

    this.isLoading = true;

    this.recordingDataService.getTractIndex(this.instrumentRecordingUID, this.recordingActUID)
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
    this.cardTitle = 'Visor y editor de predios';
    this.setTitleText();
    this.setCardHint();
    this.setTextTabs();
  }


  private setTitleText(){
    this.cardTitle = 'Visor y editor de predios';

    if (this.isAssociation) {
      this.cardTitle = 'Visor y editor de asociaciones';
      return;
    }

    if (this.isNoProperty) {
      this.cardTitle = 'Visor y editor de documentos';
      return;
    }
  }


  private setCardHint() {
    this.cardHint = `<strong>${this.tractIndex.recordableSubject.electronicID}</strong>`;
  }


  private setTextTabs(){
    if (this.isRealEstate) {
      this.tabEditorLabel = 'Datos del predio';
      return;
    }

    if (this.isAssociation) {
      this.tabEditorLabel = 'Información de la asociación';
      return;
    }

    this.tabEditorLabel = 'Información';
  }

}
