/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { EventInfo } from '@app/core';

import { MessageBoxService } from '@app/shared/services';

import { sendEvent } from '@app/shared/utils';

import { Certificate, RegistryEntryData } from '@app/models';


export enum CertificateListEventType {
  SELECT_CERTIFICATE        = 'CertificateListComponent.Event.SelectCertificate',
  REMOVE_CERTIFICATE        = 'CertificateListComponent.Event.RemoveCertificate',
  SELECT_RECORDABLE_SUBJECT = 'CertificateListComponent.Event.SelectRecordableSubject',
}

@Component({
  selector: 'emp-land-certificate-list',
  templateUrl: './certificate-list.component.html',
})
export class CertificateListComponent implements OnChanges {

  @Input() transactionUID = '';

  @Input() certificatesList: Certificate[] = [];

  @Output() certificateListEvent = new EventEmitter<EventInfo>();

  private displayedColumnsDefault = ['type', 'certificateID', 'recordableSubject',
    'issueTime', 'status'];

  displayedColumns = [...this.displayedColumnsDefault];

  dataSource: MatTableDataSource<Certificate>;


  constructor(private messageBox: MessageBoxService) { }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.certificatesList) {
      this.dataSource = new MatTableDataSource(this.certificatesList);
      this.resetColumns();
    }
  }


  onOpenCertificateEditor(certificate: Certificate) {
    sendEvent(this.certificateListEvent, CertificateListEventType.SELECT_CERTIFICATE, {certificate});
  }


  onOpenRecordableSubjectTabbedView(certificate: Certificate) {
    const payload: RegistryEntryData = {
      instrumentRecordingUID: certificate.issuingRecordingContext.instrumentRecordingUID,
      recordingActUID: certificate.issuingRecordingContext.recordingActUID,
      title: this.getRegistryEntryDataTitle(certificate),
      view: 'RecordableSubject',
      actions: { can: { editRecordableSubject: false} },
    };

    sendEvent(this.certificateListEvent, CertificateListEventType.SELECT_RECORDABLE_SUBJECT, payload);
  }


  onRemoveCertificateClicked(certificate: Certificate) {
    const message = this.getConfirmMessageToRemove(certificate);

    this.messageBox.confirm(message, 'Eliminar certificado', 'DeleteCancel')
      .firstValue()
      .then(x => {
        if (x) {
          const payload = {
            transactionUID: this.transactionUID,
            certificateUID: certificate.uid
          };

          sendEvent(this.certificateListEvent ,CertificateListEventType.REMOVE_CERTIFICATE, payload);
        }
      });
  }


  private resetColumns() {
    this.displayedColumns = [...[], ...this.displayedColumnsDefault];

    if (this.certificatesList.filter(x => x.actions.canDelete).length > 0) {
      this.displayedColumns.push('action');
    }
  }


  private getConfirmMessageToRemove(certificate: Certificate): string {
    return `Esta operación eliminará el certificado ` +
           `<strong>${certificate.type}: ${certificate.certificateID}</strong> ` +
           `<br><br>¿Elimino el certificado?`;
  }


  private getRegistryEntryDataTitle(certificate: Certificate): string {
    const index = this.certificatesList.indexOf(certificate) + 1;
    const certificateName = certificate.recordableSubject.electronicID;
    return '<strong>' + index + '&nbsp; &nbsp; | &nbsp; &nbsp;' + certificateName + '</strong>';
  }

}
