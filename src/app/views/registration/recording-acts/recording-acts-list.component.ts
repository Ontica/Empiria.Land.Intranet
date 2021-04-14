/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */


import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { Command, PresentationLayer, SubscriptionHelper } from '@app/core/presentation';
import { RegistrationAction, RegistrationCommandType } from '@app/core/presentation/presentation-types';

import { EmptyInstrumentRecording, InstrumentRecording, RecordingAct, SelectionAct } from '@app/models';
import { AlertService } from '@app/shared/containers/alert/alert.service';

import { MessageBoxService } from '@app/shared/containers/message-box';


@Component({
  selector: 'emp-land-recording-acts-list',
  templateUrl: './recording-acts-list.component.html',
})
export class RecordingActsListComponent implements OnChanges, OnDestroy {

  @Input() instrumentRecording: InstrumentRecording = EmptyInstrumentRecording;

  @Input() recordingActs: RecordingAct[] = [];

  @Input() showCopyToClipboard = false;

  @Input() title = 'Actos jurídicos contenidos en el documento';

  helper: SubscriptionHelper;

  submitted = false;

  dataSource: MatTableDataSource<RecordingAct>;

  private displayedColumnsDefault = ['number', 'name', 'electronicID', 'actionCopy',
                                     'type', 'notes', 'status'];

  displayedColumns = [...this.displayedColumnsDefault];


  constructor(private uiLayer: PresentationLayer,
              private messageBox: MessageBoxService,
              private alertService: AlertService) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.recordingActs) {
      this.dataSource = new MatTableDataSource(this.recordingActs);
    }

    this.resetColumns();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  onOpenRecordingActEditor(recordingAct: RecordingAct) {
    const selectionAct: SelectionAct = { instrumentRecording: this.instrumentRecording, recordingAct };
    this.uiLayer.dispatch(RegistrationAction.SELECT_RECORDING_ACT, selectionAct );
  }


  showAlertTextCopied(copied: boolean) {
    const message = copied ? 'Folio real copiado' : 'Tuve un problema al copiar el folio real ';
    this.alertService.openAlert(message, 'Ok');
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

    if (!this.showCopyToClipboard) {
      this.displayedColumns.splice(3, 1);
    }

    if (this.instrumentRecording.actions.can.editRecordingActs) {
      this.displayedColumns.push('actionDelete');
    }
  }


  private getConfirmMessage(recordingAct: RecordingAct): string {
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


  private executeCommand<T>(commandType: RegistrationCommandType, payload?: any): Promise<T> {
    const command: Command = {
      type: commandType,
      payload
    };

    return this.uiLayer.execute<T>(command);
  }

}
