/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';

import { DateStringLibrary, EventInfo } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { EmptyTractIndexEntry, RecordableSubjectType, TractIndexEntry } from '@app/models';


@Component({
  selector: 'emp-land-tract-index-entry-tabbed-view',
  templateUrl: './tract-index-entry-tabbed-view.component.html',
})
export class TractIndexEntryTabbedViewComponent implements OnChanges, OnDestroy {

  @Input() tractIndexEntry: TractIndexEntry = EmptyTractIndexEntry;

  @Output() closeEvent = new EventEmitter<void>();

  helper: SubscriptionHelper;

  cardTitle = '';

  cardHint = '';

  submitted = false;

  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.tractIndexEntry) {
      this.initTexts();
    }
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get displayStampMediaTab(): boolean {
    return !!this.tractIndexEntry.documentID && !!this.tractIndexEntry.stampMedia.url;
  }


  get recordableSubjectTabName(){
    if (this.tractIndexEntry.recordableSubject.type === RecordableSubjectType.RealEstate) {
      return 'Predio';
    }

    if (this.tractIndexEntry.recordableSubject.type === RecordableSubjectType.Association) {
      return 'Asociación';
    }

    if (this.tractIndexEntry.recordableSubject.type === RecordableSubjectType.NoProperty) {
      return 'Documento';
    }

    return 'Información';
  }


  onClose() {
    this.closeEvent.emit();
  }


  onRecordingActEditionEventType(event: EventInfo) {
    console.log(`Unhandled user interface event ${event.type}`);
  }


  private initTexts(){
    this.cardTitle = `${this.tractIndexEntry.name}`;

    this.cardHint = !this.tractIndexEntry.documentID ? 'Información del acto jurídico seleccionado' :
      `<strong>${this.tractIndexEntry.documentID}</strong>`;

    if (!!this.tractIndexEntry.recordingTime) {
      this.cardHint += `&nbsp; &nbsp; | &nbsp; &nbsp;` +
        `${DateStringLibrary.format(this.tractIndexEntry.recordingTime)}`;
    }
  }

}
