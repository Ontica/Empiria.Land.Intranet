/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output } from '@angular/core';

import { Assertion, Command, EventInfo } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { InstrumentRecording, RealEstate, RecordingActEntry } from '@app/models';

import { RegistrationCommandType } from '@app/presentation/exported.presentation.types';

import {
  NoPropertyEditorComponentEventType
} from '@app/views/recordable-subjects/no-property/no-property-editor.component';

import {
  RealEstateEditorComponentEventType
} from '@app/views/recordable-subjects/real-estate/real-estate-editor.component';

export enum RecordableSubjectTabbedViewEventType {
  UPDATED_RECORDABLE_SUBJECT = 'RecordableSubjectTabbedViewComponent.Event.UpdatedRecordableSubject',
}


@Component({
  selector: 'emp-land-recordable-subject-tabbed-view',
  templateUrl: './recordable-subject-tabbed-view.component.html',
})
export class RecordableSubjectTabbedViewComponent implements OnChanges, OnDestroy {

  @Input() instrumentRecording: InstrumentRecording;

  @Input() recordingAct: RecordingActEntry;

  @Output() closeEvent = new EventEmitter<void>();

  @Output() recordableSubjectTabbedViewEvent = new EventEmitter<EventInfo>();

  helper: SubscriptionHelper;

  cardTitle = 'Visor y editor';

  cardHint: string;

  tabEditorLabel = 'Datos del predio';

  submitted = false;

  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnChanges() {
    this.initTexts();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  onClose() {
    this.closeEvent.emit();
  }


  get isRealEstate() {
    return this.recordingAct.recordableSubject.type === 'RealEstate';
  }


  get isAssociation() {
    return this.recordingAct.recordableSubject.type === 'Association';
  }


  get isNoProperty() {
    return this.recordingAct.recordableSubject.type === 'NoProperty';
  }


  get realEstate(): RealEstate {
    return this.recordingAct.recordableSubject as RealEstate;
  }


  onRealEstateEditorEvent(event) {
    if (this.submitted) {
      return;
    }

    switch (event.type as RealEstateEditorComponentEventType) {
      case RealEstateEditorComponentEventType.UPDATE_REAL_ESTATE:
        this.updateRecordableSubject(event.payload);
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
        this.updateRecordableSubject(event.payload);
        return;

      default:
        throw Assertion.assertNoReachThisCode(`Unrecoginzed event ${event.type}.`);
    }
  }


  private updateRecordableSubject(data: any) {
    Assertion.assertValue(data.instrumentRecordingUID, 'event.payload.instrumentRecordingUID');
    Assertion.assertValue(data.recordingActUID, 'event.payload.recordingActUID');
    Assertion.assertValue(data.recordableSubjectFields, 'event.payload.recordableSubjectFields');

    this.executeCommand(RegistrationCommandType.UPDATE_RECORDABLE_SUBJECT, data)
      .then(instrumentRecording =>
        this.sendEvent(RecordableSubjectTabbedViewEventType.UPDATED_RECORDABLE_SUBJECT, {instrumentRecording})
      );
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
    this.cardHint = `<strong>${this.recordingAct.recordableSubject.electronicID}</strong>`;
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


  private executeCommand<T>(commandType: any, payload?: any): Promise<T> {
    this.submitted = true;

    const command: Command = {
      type: commandType,
      payload
    };

    return this.uiLayer.execute<T>(command)
      .finally(() => this.submitted = false);
  }


  private sendEvent(eventType: RecordableSubjectTabbedViewEventType, payload?: any) {
    const event: EventInfo = {
      type: eventType,
      payload
    };

    this.recordableSubjectTabbedViewEvent.emit(event);
  }

}
