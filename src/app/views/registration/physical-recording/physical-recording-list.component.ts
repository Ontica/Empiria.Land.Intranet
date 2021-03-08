/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */


import { Component, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { Command } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';
import { InstrumentsCommandType } from '@app/core/presentation/presentation-types';

import { PhysicalRecording } from '@app/models';
import { MessageBoxService } from '@app/shared/containers/message-box';

import {
  FilePrintPreviewComponent
} from '@app/shared/form-controls/file-print-preview/file-print-preview.component';


@Component({
  selector: 'emp-land-physical-recording-list',
  templateUrl: './physical-recording-list.component.html',
})
export class PhysicalRecordingListComponent implements OnChanges, OnDestroy {

  @ViewChild('filePrintPreview', { static: true }) filePrintPreview: FilePrintPreviewComponent;

  @Input() transactionUID: string;

  @Input() instrumentUID: string;

  @Input() physicalRecordings: PhysicalRecording[] = [];

  @Input() showRegistrationStamps = false;

  @Input() canDelete = false;

  helper: SubscriptionHelper;

  submitted = false;

  dataSource: MatTableDataSource<PhysicalRecording>;

  private displayedColumnsDefault = ['recordingTime', 'recorderOfficeName', 'recordingSectionName',
                                     'volumeNo', 'recordingNo', 'recordedBy'];

  displayedColumns = [...this.displayedColumnsDefault];


  constructor(private uiLayer: PresentationLayer,
              private messageBox: MessageBoxService) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.physicalRecordings) {
      this.dataSource = new MatTableDataSource(this.physicalRecordings);
    }

    this.resetColumns();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  resetColumns() {
    this.displayedColumns = [];

    if (this.showRegistrationStamps) {
      this.displayedColumns.push('stampMedia');
    }

    this.displayedColumns = [...this.displayedColumns, ...this.displayedColumnsDefault];

    if (this.canDelete) {
      this.displayedColumns.push('action');
    }
  }


  removePhysicalRecording(recording: PhysicalRecording) {
    if (!this.submitted) {
      const message = this.getConfirmMessage(recording);

      this.messageBox.confirm(message, 'Eliminar registro', 'DeleteCancel')
        .toPromise()
        .then(x => {
          if (x) {
            this.submitted = true;

            const payload = {
              transactionUID: this.transactionUID,
              instrumentUID: this.instrumentUID,
              physicalRecordingUID: recording.uid
            };

            this.executeCommand(InstrumentsCommandType.DELETE_PHYSICAL_RECORDING, payload)
              .then(() => this.submitted = false);
          }
        });
    }
  }


  printStampMedia(recording: PhysicalRecording) {
    this.filePrintPreview.open(recording.stampMedia.url, recording.stampMedia.mediaType);
  }


  private getConfirmMessage(recording: PhysicalRecording): string {
    return `
      <table style="margin: 0;">
        <tr><td>Distrito: </td><td><strong> ${recording.recorderOfficeName} </strong></td></tr>

        <tr><td>Sección: </td><td><strong> ${recording.recordingSectionName} </strong></td></tr>

        <tr><td>Volumen: </td><td><strong> ${recording.volumeNo} </strong></td></tr>

        <tr><td>Inscripción: </td><td><strong> ${recording.recordingNo} </strong></td></tr>

      </table>

      <br>¿Elimino el registro?`;
  }


  private executeCommand<T>(commandType: InstrumentsCommandType, payload?: any): Promise<T> {
    const command: Command = {
      type: commandType,
      payload
    };

    return this.uiLayer.execute<T>(command);
  }

}
