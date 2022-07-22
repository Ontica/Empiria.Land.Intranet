/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */


import { Component, Input, OnChanges, OnDestroy } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { TractIndexEntry } from '@app/models';

import { MessageBoxService } from '@app/shared/containers/message-box';


@Component({
  selector: 'emp-land-recordable-subject-history',
  templateUrl: './recordable-subject-history.component.html',
})
export class RecordableSubjectHistoryComponent implements OnChanges, OnDestroy {

  @Input() recordableSubjectUID = '';

  @Input() tractIndexEntriesList: TractIndexEntry[] = [];

  @Input() canEdit = false;

  helper: SubscriptionHelper;

  submitted = false;

  dataSource: MatTableDataSource<TractIndexEntry>;

  private displayedColumnsDefault = ['number', 'description', 'officialDocument', 'summary', 'requestedTime',
    'status'];

  displayedColumns = [...this.displayedColumnsDefault];


  constructor(private uiLayer: PresentationLayer,
              private messageBox: MessageBoxService) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnChanges() {
    this.dataSource = new MatTableDataSource(this.tractIndexEntriesList);
    this.resetColumns();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  onOpenRecordingActCreator() {
    this.messageBox.showInDevelopment('Agregar acto jurídico', this.recordableSubjectUID);
  }


  onOpenRecordingActEditor(recordingAct: TractIndexEntry) {
    if (this.canEdit) {
      this.messageBox.showInDevelopment('Editar acto jurídico', recordingAct);
    }
  }


  onCloseTractIndex() {
      if (!this.submitted) {
      const message = this.getConfirmMessageToCloseTractIndex();

      this.messageBox.confirm(message, 'Cerrar la historia', 'AcceptCancel')
        .toPromise()
        .then(x => {
          if (x) {
            this.submitted = true;

            setTimeout(() => {
              this.messageBox.showInDevelopment('Cerrar la historia', {recordableSubjectUID: this.recordableSubjectUID});
              this.submitted = false;
            }, 500);
          }
        });
    }
  }


  removeRecordingAct(recordingAct: TractIndexEntry) {
    if (!this.submitted) {
      const message = this.getConfirmMessageToRemove(recordingAct);

      this.messageBox.confirm(message, 'Eliminar acto jurídico', 'DeleteCancel')
        .toPromise()
        .then(x => {
          if (x) {
            this.submitted = true;

            const payload = {
              recordableSubjectUID: this.recordableSubjectUID,
              recordingActUID: recordingAct.uid
            };

            setTimeout(() => {
              this.messageBox.showInDevelopment('Eliminar acto jurídico', payload);
              this.submitted = false;
            }, 500);

          }
        });
    }
  }


  private resetColumns() {
    this.displayedColumns = [...[], ...this.displayedColumnsDefault];

    if (this.canEdit) {
      this.displayedColumns.push('action');
    }
  }


  private getConfirmMessageToRemove(recordingAct: TractIndexEntry): string {
    return `Esta operación eliminará el acto jurídico <strong>${recordingAct.description}</strong> ` +
           `inscrito en <strong>${recordingAct.officialDocument.description}</strong>.` +
           `<br><br>¿Elimino el acto jurídico?`;
  }


  private getConfirmMessageToCloseTractIndex(): string {
    return `Esta operación marcará la historia como completa.` +
           `<br><br>¿Cierro la historia?`;
  }

}
