/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */


import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { EventInfo } from '@app/core';

import { EmptyInstrumentRecording, getRecordableObjectStatusName, InstrumentRecording, RecordableObjectStatus,
         RecordingActEntry, SelectionAct } from '@app/models';

import { AlertService } from '@app/shared/containers/alert/alert.service';

import { MessageBoxService } from '@app/shared/containers/message-box';

export enum RecordingActsListEventType {
  REMOVE_RECORDING_ACT = 'RecordingActsListComponent.Event.RemoveRecordingAct',
  SELECT_RECORDABLE_SUBJECT = 'RecordingActsListComponent.Event.SelectRecordableSubject',
  SELECT_RECORDING_ACT = 'RecordingActsListComponent.Event.SelectRecordingAct',
}

@Component({
  selector: 'emp-land-recording-acts-list',
  templateUrl: './recording-acts-list.component.html',
})
export class RecordingActsListComponent implements OnChanges {

  @Input() instrumentRecording: InstrumentRecording = EmptyInstrumentRecording;

  @Input() recordingActs: RecordingActEntry[] = [];

  @Input() title = 'Actos jurídicos contenidos en el documento';

  @Output() recordingActsListEvent = new EventEmitter<EventInfo>();

  dataSource: MatTableDataSource<RecordingActEntry>;

  private displayedColumnsDefault = ['number', 'name', 'electronicID', 'actionCopy',
                                     'type', 'notes', 'status'];

  displayedColumns = [...this.displayedColumnsDefault];


  constructor(private messageBox: MessageBoxService,
              private alertService: AlertService) {
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.recordingActs) {
      this.dataSource = new MatTableDataSource(this.recordingActs);
    }

    this.resetColumns();
  }


  getRecordableObjectStatusName(status: RecordableObjectStatus) {
    return getRecordableObjectStatusName(status).statusName;
  }


  onOpenRecordableSubjactTabbedView(recordingAct: RecordingActEntry) {
    const selectionAct: SelectionAct =
      { instrumentRecording: this.instrumentRecording, recordingAct };
    this.sendEvent(RecordingActsListEventType.SELECT_RECORDABLE_SUBJECT, selectionAct);
  }


  onOpenRecordingActEditor(recordingAct: RecordingActEntry) {
    const selectionAct: SelectionAct = { instrumentRecording: this.instrumentRecording, recordingAct };
    this.sendEvent(RecordingActsListEventType.SELECT_RECORDING_ACT, selectionAct);
  }


  showAlertTextCopied(copied: boolean) {
    const message = copied ? 'Folio real copiado' : 'Tuve un problema al copiar el folio real ';
    this.alertService.openAlert(message, 'Ok');
  }


  removeRecordingAct(recordingAct: RecordingActEntry) {
    const message = this.getConfirmMessage(recordingAct);

    this.messageBox.confirm(message, 'Eliminar registro', 'DeleteCancel')
      .toPromise()
      .then(x => {
        if (x) {
          const payload = {
            instrumentRecordingUID: this.instrumentRecording.uid,
            recordingActUID: recordingAct.uid
          };

          this.sendEvent(RecordingActsListEventType.REMOVE_RECORDING_ACT, payload);
        }
      });
  }


  private resetColumns() {
    this.displayedColumns = [];

    this.displayedColumns = [...this.displayedColumns, ...this.displayedColumnsDefault];

    if (this.instrumentRecording.actions.can.editRecordingActs) {
      this.displayedColumns.push('actionDelete');
    }
  }


  private getConfirmMessage(recordingAct: RecordingActEntry): string {
    return `
      <table style='margin: 0;'>
        <tr><td>Acto jurídico: </td><td><strong> ${recordingAct.name} </strong></td></tr>

        <tr><td class='nowrap'>Folio electrónico: </td><td><strong>
          ${recordingAct.recordableSubject.electronicID}
        </strong></td></tr>

        <tr><td>Tipo: </td><td><strong>
          ${recordingAct.recordableSubject.kind ? recordingAct.recordableSubject.kind : '-'}
        </strong></td></tr>

      </table>

     <br>¿Elimino el registro?`;
  }


  private sendEvent(eventType: RecordingActsListEventType, payload?: any) {
    const event: EventInfo = {
      type: eventType,
      payload
    };

    this.recordingActsListEvent.emit(event);
  }

}
