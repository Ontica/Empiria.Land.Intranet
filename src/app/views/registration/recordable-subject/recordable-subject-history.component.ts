/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */


import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { ROUTES } from '@app/main-layout';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { MessageBoxService, UrlViewerService } from '@app/shared/services';

import { sendEvent } from '@app/shared/utils';

import { RecordingDataService } from '@app/data-services';

import { EmptyTractIndex, EmptyTractIndexEntry, TractIndex, TractIndexEntry } from '@app/models';

import {
  TractIndexEntriesTableEventType
} from '@app/views/land-controls/tract-index/tract-index-entries-table.component';

import { RecordingActCreatorModalEventType } from '../recording-acts/recording-act-creator-modal.component';

import { RecordingActEditionModalEventType } from '../recording-acts/recording-act-edition-modal.component';


export enum RecordableSubjectHistoryEventType {
  TRACT_INDEX_UPDATED = 'RecordableSubjectHistoryComponent.Event.TractIndexUpdated',
  TRACT_INDEX_REFRESH = 'RecordableSubjectHistoryComponent.Event.TractIndexRefresh',
}

interface TractIndexEntryDataTable extends TractIndexEntry {
  number?: string;
  isChild?: boolean;
}


@Component({
  selector: 'emp-land-recordable-subject-history',
  templateUrl: './recordable-subject-history.component.html',
})
export class RecordableSubjectHistoryComponent implements OnChanges, OnDestroy {

  @Input() tractIndex: TractIndex = EmptyTractIndex;

  @Input() recordingActUID = '';

  @Input() isLoading = false;

  @Output() recordableSubjectHistoryEvent = new EventEmitter<EventInfo>();

  submitted = false;

  displayRecordingActCreator = false;

  displayRecordingActEdition = false;

  tractIndexEntrySelected: TractIndexEntryDataTable = EmptyTractIndexEntry;

  helper: SubscriptionHelper;

  bookEntryUrl = ROUTES.historic_registration_book_entry.fullpath;

  hasNestedEntries = false;

  checkNestedEntries = false;

  constructor(private uiLayer: PresentationLayer,
              private recordingData: RecordingDataService,
              private messageBox: MessageBoxService,
              private urlViewer: UrlViewerService) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.tractIndex) {
      this.setHasNestedEntries();
    }
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  onTractIndexEntriesTableEvent(event: EventInfo) {
    switch (event.type as TractIndexEntriesTableEventType) {

      case TractIndexEntriesTableEventType.RECORDING_ACT_CLICKED:
        Assertion.assertValue(event.payload.tractIndexEntry, 'event.payload.tractIndexEntry');
        this.setTractIndexEntrySelected(event.payload.tractIndexEntry as TractIndexEntry);
        return;

      case TractIndexEntriesTableEventType.BOOK_ENTRY_CLICKED:
        Assertion.assertValue(event.payload.tractIndexEntry, 'event.payload.tractIndexEntry');
        this.validateOpenBookEntry(event.payload.tractIndexEntry as TractIndexEntry);
        return;

      case TractIndexEntriesTableEventType.REMOVE_RECORDING_ACT_CLICKED:
        if (this.submitted) {
          return;
        }

        Assertion.assertValue(event.payload.tractIndexEntry.uid, 'event.payload.tractIndexEntry.uid');
        this.removeRecordingActFromTractIndex(this.tractIndex.recordableSubject.uid,
                                              event.payload.tractIndexEntry.uid);

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onOpenRecordingActCreator() {
    if (this.tractIndex.actions.canBeUpdated) {
      this.displayRecordingActCreator = true;
    }
  }


  onRecordingActCreatorModalEvent(event: EventInfo) {
    switch (event.type as RecordingActCreatorModalEventType) {
      case RecordingActCreatorModalEventType.CLOSE_MODAL_CLICKED:
        this.displayRecordingActCreator = false;
        return;

      case RecordingActCreatorModalEventType.RECORDING_ACT_CREATED:
        this.displayRecordingActCreator = false;
        sendEvent(this.recordableSubjectHistoryEvent, RecordableSubjectHistoryEventType.TRACT_INDEX_UPDATED,
          event.payload);
        break;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onRecordingActEditionModalEvent(event: EventInfo) {
    switch (event.type as RecordingActEditionModalEventType) {
      case RecordingActEditionModalEventType.CLOSE_MODAL_CLICKED:
        this.setTractIndexEntrySelected(EmptyTractIndexEntry);
        return;

      case RecordingActEditionModalEventType.RECORDING_ACT_UPDATED:
        this.setTractIndexEntrySelected(EmptyTractIndexEntry);
        sendEvent(this.recordableSubjectHistoryEvent, RecordableSubjectHistoryEventType.TRACT_INDEX_REFRESH,
          event.payload);
        break;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onCloseTractIndex() {
      if (this.tractIndex.actions.canBeClosed && !this.submitted) {
      const message = `Esta operación marcará la historia registral como completa.<br><br>` +
                      `¿Todos los actos de la propiedad están registrados?`;

      this.messageBox.confirm(message, 'Cerrar la historia registral', 'AcceptCancel')
        .firstValue()
        .then(x => {
          if (x) {
            this.closeTractIndex();
          }
        });
    }
  }


  onOpenTractIndex() {
      if (this.tractIndex.actions.canBeOpened && !this.submitted) {
      const message = `Esta operación abrirá la historia registral para su edición.<br><br>¿Abro la historia?`;

      this.messageBox.confirm(message, 'Abrir la historia registral', 'AcceptCancel')
        .firstValue()
        .then(x => {
          if (x) {
            this.openTractIndex();
          }
        });
    }
  }


  private validateOpenBookEntry(tractIndexEntry: TractIndexEntry) {
    if (!tractIndexEntry.recordingData.bookEntry) {
      this.urlViewer.openWindowCentered(tractIndexEntry.recordingData.media.url);
    } else {
      this.confirmRedirectToBookEntryWindow(tractIndexEntry);
    }
  }


  private setHasNestedEntries() {
    this.hasNestedEntries = this.tractIndex.entries.filter(x => !isEmpty(x.amendedAct)).length > 0;
    this.checkNestedEntries = false;
  }


  private setTractIndexEntrySelected(tractIndexEntry: TractIndexEntry) {
    this.tractIndexEntrySelected = tractIndexEntry;
    this.displayRecordingActEdition = !isEmpty(this.tractIndexEntrySelected);
  }


  private confirmRedirectToBookEntryWindow(tractIndexEntry: TractIndexEntry) {
    this.messageBox.confirm(this.getConfirmMessageToRedirect(tractIndexEntry),
                            'Abrir inscripción en una nueva pestaña')
      .firstValue()
      .then(x => {
        if(x) {
          this.urlViewer.openRouteInNewTab(this.bookEntryUrl, tractIndexEntry.recordingData.bookEntry);
        }
      });
  }


  private getConfirmMessageToRedirect(tractIndexEntry: TractIndexEntry): string {
    return `Esta operación abrirá la ` +
           `<strong>${tractIndexEntry.recordingData.description}</strong> ` +
           `en otra pestaña del navegador. <br><br>¿Continuo con la operación?`;
  }


  private removeRecordingActFromTractIndex(recordableSubjectUID: string, recordingActUID: string) {
    this.submitted = true;

    this.recordingData.removeRecordingActFromTractIndex(recordableSubjectUID, recordingActUID)
      .firstValue()
      .then(x =>{
        this.messageBox.show('El acto jurídico fue eliminado correctamente.', 'Eliminar acto jurídico')
        sendEvent(this.recordableSubjectHistoryEvent, RecordableSubjectHistoryEventType.TRACT_INDEX_UPDATED,
          {tractIndex: x})
      })
      .finally(() => this.submitted = false);
  }


  private closeTractIndex() {
    this.submitted = true;

    this.recordingData.closeTractIndex(this.tractIndex.recordableSubject.uid)
      .firstValue()
      .then(x =>
        sendEvent(this.recordableSubjectHistoryEvent, RecordableSubjectHistoryEventType.TRACT_INDEX_UPDATED,
          {tractIndex: x})
      )
      .finally(() => this.submitted = false);
  }


  private openTractIndex() {
    this.submitted = true;

    this.recordingData.openTractIndex(this.tractIndex.recordableSubject.uid)
      .firstValue()
      .then(x =>
        sendEvent(this.recordableSubjectHistoryEvent, RecordableSubjectHistoryEventType.TRACT_INDEX_UPDATED,
          {tractIndex: x})
      )
      .finally(() => this.submitted = false);
  }

}
