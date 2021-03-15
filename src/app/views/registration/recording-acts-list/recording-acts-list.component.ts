/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */


import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { Command } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';
import { RecordingActsAction } from '@app/core/presentation/presentation-types';
import { RecordingAct } from '@app/models';

import { MessageBoxService } from '@app/shared/containers/message-box';


@Component({
  selector: 'emp-land-recording-acts-list',
  templateUrl: './recording-acts-list.component.html',
})
export class RecordingActsListComponent implements OnChanges, OnDestroy {

  @Input() instrumentUID: string;

  @Input() recordingActs: RecordingAct[] = [];

  @Input() canDelete = false;

  helper: SubscriptionHelper;

  submitted = false;

  dataSource: MatTableDataSource<RecordingAct>;

  private displayedColumnsDefault = ['number', 'name', 'electronicID', 'type', 'notes'];

  displayedColumns = [...this.displayedColumnsDefault];


  constructor(private uiLayer: PresentationLayer,
              private messageBox: MessageBoxService) {
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


  onOpenRecordingActEditor(recordingAct: RecordingAct){
    this.uiLayer.dispatch(RecordingActsAction.SELECT_RECORDING_ACT, { recordingAct });
  }


  removeRecordingActs(recordingAct: RecordingAct) {
    if (!this.submitted) {
      const message = this.getConfirmMessage(recordingAct);

      this.messageBox.confirm(message, 'Eliminar registro', 'DeleteCancel')
        .toPromise()
        .then(x => {
          if (x) {
            this.submitted = true;

            const payload = {
              instrumentUID: this.instrumentUID,
              recordingActUID: recordingAct.uid
            };

            console.log(payload);

            // this.executeCommand(InstrumentsCommandType.DELETE_PHYSICAL_RECORDING, payload)
            //   .then(() => this.submitted = false);
          }
        });
    }
  }


  private resetColumns() {
    this.displayedColumns = [];

    this.displayedColumns = [...this.displayedColumns, ...this.displayedColumnsDefault];

    if (this.canDelete) {
      this.displayedColumns.push('action');
    }
  }


  private getConfirmMessage(recordingAct: RecordingAct): string {
    return `¿Elimino el registro?`;
    // `
    //   <table style="margin: 0;">
    //     <tr><td>Distrito: </td><td><strong> ${recording.recorderOfficeName} </strong></td></tr>

    //     <tr><td>Sección: </td><td><strong> ${recording.recordingSectionName} </strong></td></tr>

    //     <tr><td>Volumen: </td><td><strong> ${recording.volumeNo} </strong></td></tr>

    //     <tr><td>Inscripción: </td><td><strong> ${recording.recordingNo} </strong></td></tr>

    //   </table>

    //  <br>¿Elimino el registro?`;
  }


  // private executeCommand<T>(commandType: InstrumentsCommandType, payload?: any): Promise<T> {
  //   const command: Command = {
  //     type: commandType,
  //     payload
  //   };

  //   return this.uiLayer.execute<T>(command);
  // }

}
