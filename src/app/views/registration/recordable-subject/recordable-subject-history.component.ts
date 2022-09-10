/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */


import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { EventInfo, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { RecordingDataService } from '@app/data-services';

import { ROUTES_LIBRARY } from '@app/main-layout';

import { EmptyTractIndex, EmptyTractIndexEntry, TractIndex, TractIndexEntry } from '@app/models';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { UrlViewerService } from '@app/shared/services';

import { sendEvent } from '@app/shared/utils';

import { RecordingActCreatorModalEventType } from '../recording-acts/recording-act-creator-modal.component';

import { RecordingActEditionModalEventType } from '../recording-acts/recording-act-edition-modal.component';

export enum RecordableSubjectHistoryEventType {
  TRACT_INDEX_UPDATED = 'RecordableSubjectHistoryComponent.Event.TractIndexUpdated',
  TRACT_INDEX_REFRESH = 'RecordableSubjectHistoryComponent.Event.TractIndexRefresh',
}


@Component({
  selector: 'emp-land-recordable-subject-history',
  templateUrl: './recordable-subject-history.component.html',
})
export class RecordableSubjectHistoryComponent implements OnChanges, OnDestroy {

  @Input() tractIndex: TractIndex = EmptyTractIndex;

  @Output() recordableSubjectHistoryEvent = new EventEmitter<EventInfo>();

  private displayedColumnsDefault = ['rowIndex', 'issuedAndRequestedTime', 'recordingAct',
                                     'subjectChanges', 'recordLink', 'status'];

  displayedColumns = [...this.displayedColumnsDefault];

  dataSource: MatTableDataSource<TractIndexEntry>;

  submitted = false;

  displayRecordingActCreator = false;

  displayRecordingActEdition = false;

  tractIndexEntrySelected: TractIndexEntry = EmptyTractIndexEntry;

  helper: SubscriptionHelper;

  bookEntryUrl = ROUTES_LIBRARY.historic_registration_book_entry.fullpath;

  constructor(private uiLayer: PresentationLayer,
              private recordingData: RecordingDataService,
              private messageBox: MessageBoxService,
              private urlViewer: UrlViewerService) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnChanges() {
    this.dataSource = new MatTableDataSource(this.tractIndex.entries);
    this.resetColumns();
  }


  ngOnDestroy() {
    this.helper.destroy();
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


  onOpenRecordingActEditor(tractIndexEntry: TractIndexEntry) {
    this.setTractIndexEntrySelected(tractIndexEntry);
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
        .toPromise()
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
        .toPromise()
        .then(x => {
          if (x) {
            this.openTractIndex();
          }
        });
    }
  }


  onOpenBookEntry(tractIndexEntry: TractIndexEntry) {
    if (!tractIndexEntry.officialDocument.bookEntry) {
      this.urlViewer.openWindowCentered(tractIndexEntry.officialDocument.media.url);
    } else {
      this.confirmRedirectToBookEntryWindow(tractIndexEntry);
    }
  }


  onRemoveRecordingActClicked(recordingAct: TractIndexEntry) {
    if (recordingAct.actions.canBeDeleted && !this.submitted) {
      const message = this.getConfirmMessageToRemove(recordingAct);

      this.messageBox.confirm(message, 'Eliminar acto jurídico', 'DeleteCancel')
        .toPromise()
        .then(x => {
          if (x) {
            this.removeRecordingActFromTractIndex(this.tractIndex.recordableSubject.uid, recordingAct.uid);
          }
        });
    }
  }


  private resetColumns() {
    this.displayedColumns = [...[], ...this.displayedColumnsDefault];

    if (this.tractIndex.entries.filter(x => x.actions.canBeDeleted).length > 0) {
      this.displayedColumns.push('action');
    }
  }


  private setTractIndexEntrySelected(tractIndexEntry: TractIndexEntry) {
    this.tractIndexEntrySelected = tractIndexEntry;
    this.displayRecordingActEdition = !isEmpty(this.tractIndexEntrySelected);
  }


  private confirmRedirectToBookEntryWindow(tractIndexEntry: TractIndexEntry) {
    this.messageBox.confirm(this.getConfirmMessageToRedirect(tractIndexEntry),
                            'Abrir inscripción en una nueva pestaña')
      .toPromise()
      .then(x => {
        if(x) {
          this.urlViewer.openRouteInNewTab(this.bookEntryUrl, tractIndexEntry.officialDocument.bookEntry);
        }
      });
  }


  private getConfirmMessageToRedirect(tractIndexEntry: TractIndexEntry): string {
    return `Esta operación abrirá la ` +
           `<strong>${tractIndexEntry.officialDocument.description}</strong> ` +
           `en otra pestaña del navegador. <br><br>¿Continuo con la operación?`;
  }


  private getConfirmMessageToRemove(tractIndexEntry: TractIndexEntry): string {
    return `Esta operación eliminará el acto jurídico <strong>${tractIndexEntry.description}</strong> ` +
           `registrado en <strong>${tractIndexEntry.officialDocument.description}</strong>.` +
           `<br><br>¿Elimino el acto jurídico?`;
  }


  private removeRecordingActFromTractIndex(recordableSubjectUID: string, recordingActUID: string) {
    this.submitted = true;

    this.recordingData.removeRecordingActFromTractIndex(recordableSubjectUID, recordingActUID)
      .toPromise()
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
      .toPromise()
      .then(x =>
        sendEvent(this.recordableSubjectHistoryEvent, RecordableSubjectHistoryEventType.TRACT_INDEX_UPDATED,
          {tractIndex: x})
      )
      .finally(() => this.submitted = false);
  }


  private openTractIndex() {
    this.submitted = true;

    this.recordingData.openTractIndex(this.tractIndex.recordableSubject.uid)
      .toPromise()
      .then(x =>
        sendEvent(this.recordableSubjectHistoryEvent, RecordableSubjectHistoryEventType.TRACT_INDEX_UPDATED,
          {tractIndex: x})
      )
      .finally(() => this.submitted = false);
  }

}
