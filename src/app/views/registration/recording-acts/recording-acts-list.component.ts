/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */


import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { EventInfo, Identifiable, isEmpty } from '@app/core';

import { EmptyInstrumentRecording, getRecordableObjectStatusName, getSizeUnitNameShort, InstrumentRecording,
         RecordableObjectStatus, RecordableSubject, RecordableSubjectType, RecordingActEntry,
         RegistryEntryData, SizeUnit, RegistryEntryView } from '@app/models';

import { AlertService } from '@app/shared/containers/alert/alert.service';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { FormatLibrary, sendEvent } from '@app/shared/utils';

export enum RecordingActsListEventType {
  REMOVE_RECORDING_ACT      = 'RecordingActsListComponent.Event.RemoveRecordingAct',
  SELECT_RECORDABLE_SUBJECT = 'RecordingActsListComponent.Event.SelectRecordableSubject',
  SELECT_RECORDING_ACT      = 'RecordingActsListComponent.Event.SelectRecordingAct',
}

@Component({
  selector: 'emp-land-recording-acts-list',
  templateUrl: './recording-acts-list.component.html',
})
export class RecordingActsListComponent implements OnChanges {

  @Input() instrumentRecording: InstrumentRecording = EmptyInstrumentRecording;

  @Input() recordingActs: RecordingActEntry[] = [];

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


  displayRelatedSubject(relatedSubject: RecordableSubject): boolean {
    return !isEmpty(relatedSubject);
  }


  displayLotSizeTotal(type: RecordableSubjectType): boolean {
    return type === RecordableSubjectType.RealEstate;
  }


  getLotSizeTotal(lotSize: number, lotSizeUnit: Identifiable): string {
    const formattedLotSize =
      ![SizeUnit.NoRecord, SizeUnit.Empty].includes(lotSizeUnit.uid as SizeUnit) || lotSize > 0 ?
      FormatLibrary.numberWithCommas(lotSize, '1.2-9') : '';

    return formattedLotSize + ' ' + getSizeUnitNameShort(lotSizeUnit);
  }


  onOpenRecordingActEditor(entry: RecordingActEntry) {
    sendEvent(this.recordingActsListEvent, RecordingActsListEventType.SELECT_RECORDING_ACT,
      this.getRegistryEntryData(entry, 'RecordingAct', false));
  }


  onOpenRecordableSubjectTabbedView(entry: RecordingActEntry, isRelatedSubject: boolean) {
    sendEvent(this.recordingActsListEvent, RecordingActsListEventType.SELECT_RECORDABLE_SUBJECT,
      this.getRegistryEntryData(entry, 'RecordableSubject', isRelatedSubject));
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

          sendEvent(this.recordingActsListEvent, RecordingActsListEventType.REMOVE_RECORDING_ACT, payload);
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


  private getRegistryEntryData(entry: RecordingActEntry,
                               registryEntryView: RegistryEntryView,
                               isRelatedSubject: boolean): RegistryEntryData {
    const data: RegistryEntryData = {
      instrumentRecordingUID: isRelatedSubject ? entry.relatedSubject.recordingContext.instrumentRecordingUID
                                               : entry.recordableSubject.recordingContext.instrumentRecordingUID,
      recordingActUID: isRelatedSubject ? entry.relatedSubject.recordingContext.recordingActUID
                                        : entry.recordableSubject.recordingContext.recordingActUID,
      title: this.getRegistryEntryDataTitle(entry, registryEntryView, isRelatedSubject),
      view: registryEntryView,
      actions: {
        can: {
          editRecordableSubject: !isRelatedSubject && this.instrumentRecording.actions.can.editRecordingActs,
        }
      },
    };

    return data;
  }


  private getRegistryEntryDataTitle(entry: RecordingActEntry,
                                    registryEntryView: RegistryEntryView,
                                    isRelatedSubject: boolean): string {
    const index = `<strong> ${(this.recordingActs.indexOf(entry) + 1) + '&nbsp; &nbsp; | &nbsp; &nbsp;'}`;

    if (isRelatedSubject) {
      return index + 'Fracción de: &nbsp; &nbsp; ' + entry.relatedSubject.electronicID + '</strong>';
    }

    if (!!entry.description) {
      return index + entry.description + '</strong>';
    } else {
      const recordingActName = registryEntryView === 'RecordingAct' ?
        entry.name + '&nbsp; &nbsp; | &nbsp; &nbsp;' : '';
      return index + recordingActName + entry.recordableSubject.electronicID + '</strong>';
    }
  }

}
