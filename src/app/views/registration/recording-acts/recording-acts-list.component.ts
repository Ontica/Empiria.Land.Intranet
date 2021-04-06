/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */


import { Component, Input, OnChanges, OnDestroy } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { Command, PresentationLayer, SubscriptionHelper } from '@app/core/presentation';
import { RegistrationAction, RegistrationCommandType } from '@app/core/presentation/presentation-types';

import { EmptyInstrumentRecording, InstrumentRecording, RecordingAct } from '@app/models';

import { MessageBoxService } from '@app/shared/containers/message-box';


@Component({
  selector: 'emp-land-recording-acts-list',
  templateUrl: './recording-acts-list.component.html',
})
export class RecordingActsListComponent implements OnChanges, OnDestroy {

  @Input() instrumentRecording: InstrumentRecording = EmptyInstrumentRecording;

  helper: SubscriptionHelper;

  submitted = false;

  dataSource: MatTableDataSource<RecordingAct>;

  private displayedColumnsDefault = ['number', 'name', 'electronicID', 'type', 'notes'];

  displayedColumns = [...this.displayedColumnsDefault];


  constructor(private uiLayer: PresentationLayer,
              private messageBox: MessageBoxService) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnChanges() {
    this.dataSource = new MatTableDataSource(this.instrumentRecording.recordingActs);

    this.resetColumns();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  onOpenRecordingActEditor(recordingAct: RecordingAct) {
      this.uiLayer.dispatch(RegistrationAction.SELECT_RECORDING_ACT,
                            { instrumentRecording: this.instrumentRecording, recordingAct });
  }


  removeRecordingAct(recordingAct: RecordingAct) {
    if (!this.submitted) {
      const message = this.getConfirmMessage(recordingAct);

      this.messageBox.confirm(message, 'Eliminar registro', 'DeleteCancel')
        .toPromise()
        .then(x => {
          if (x) {
            this.submitted = true;

            const payload = {
              instrumentRecordingUID: this.instrumentRecording.uid,
              recordingActUID: recordingAct.uid
            };

            this.executeCommand(RegistrationCommandType.DELETE_RECORDING_ACT, payload)
                .then(() => this.submitted = false);
          }
        });
    }
  }


  private resetColumns() {
    this.displayedColumns = [];

    this.displayedColumns = [...this.displayedColumns, ...this.displayedColumnsDefault];

    if (this.instrumentRecording.actions.can.editRecordingActs) {
      this.displayedColumns.push('action');
    }
  }


  private getConfirmMessage(recordingAct: RecordingAct): string {
    return `
      <table style="margin: 0;">
        <tr><td>Acto jurídico: </td><td><strong> ${recordingAct.name} </strong></td></tr>

        <tr><td class="nowrap">Folio electrónico: </td><td><strong>
          ${recordingAct.recordableSubject.electronicID}
        </strong></td></tr>

        <tr><td>Tipo: </td><td><strong>
          ${recordingAct.recordableSubject.kind ? recordingAct.recordableSubject.kind : '-'}
        </strong></td></tr>

      </table>

     <br>¿Elimino el registro?`;
  }


  private executeCommand<T>(commandType: RegistrationCommandType, payload?: any): Promise<T> {
    const command: Command = {
      type: commandType,
      payload
    };

    return this.uiLayer.execute<T>(command);
  }

}
