/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { EventInfo, MediaType } from '@app/core';

import { CertificationDataService } from '@app/data-services';

import { Certificate, EmptyCertificate } from '@app/models';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { UrlViewerService } from '@app/shared/services';

import { sendEvent } from '@app/shared/utils';


export enum CertificateEditionEventType {
  CLOSE_MODAL_CLICKED = 'CertificateEditionComponent.Event.CloseModalClicked',
  CERTIFICATE_UPDATED = 'CertificateEditionComponent.Event.CertificateUpdated',
}


@Component({
  selector: 'emp-land-certificate-edition',
  templateUrl: './certificate-edition.component.html',
})
export class CertificateEditionComponent implements OnChanges {

  @Input() transactionUID = '';

  @Input() certificate: Certificate = EmptyCertificate;

  @Output() certificateEditionEvent = new EventEmitter<EventInfo>();

  title = 'Editor del certificado';

  hint = '';

  submitted = false;


  constructor(private certificationData: CertificationDataService,
              private messageBox: MessageBoxService,
              private urlViewer: UrlViewerService) { }


  ngOnChanges() {
    this.setCardHint();
  }


  get isHtmlMediaFile() {
    return this.certificate.mediaLink.mediaType === MediaType.html;
  }


  onClose() {
    sendEvent(this.certificateEditionEvent, CertificateEditionEventType.CLOSE_MODAL_CLICKED);
  }


  onCloseCertificateClicked() {
    if (this.submitted) {
      return;
    }

    const message = `Esta operación cerrará el certificado.<br><br>¿Cierro el certificado?`;

    this.messageBox.confirm(message, 'Cerrar certificado')
      .firstValue()
      .then(x => {
        if (x) this.closeCertificate()
      });
  }


  onOpenCertificateClicked() {
    if (this.submitted) {
      return;
    }

    const message = `Esta operación abrirá el certificado.<br><br>¿Abro el certificado?`;

    this.messageBox.confirm(message, 'Abrir certificado')
      .firstValue()
      .then(x => {
        if (x) this.openCertificate();
      });
  }


  onPrintMediaClicked() {
    this.urlViewer.openWindowCentered(this.certificate.mediaLink.url);
  }


  private setCardHint() {
    this.hint = `<strong>${this.certificate.type}</strong>` +
      ` &nbsp; &nbsp; | &nbsp; &nbsp; <strong> ${this.certificate.certificateID} </strong>` +
      ` &nbsp; &nbsp; | &nbsp; &nbsp; ${this.certificate.recordableSubject.electronicID}`;
  }


  private closeCertificate() {
    this.submitted = true;

    this.certificationData.closeCertificate(this.transactionUID, this.certificate.uid)
      .firstValue()
      .then(x =>
          sendEvent(this.certificateEditionEvent, CertificateEditionEventType.CERTIFICATE_UPDATED,
            {certificate: x})
        )
      .finally(() => this.submitted = false);
  }


  private openCertificate() {
    this.submitted = true;

    this.certificationData.openCertificate(this.transactionUID, this.certificate.uid)
      .firstValue()
      .then(x =>
        sendEvent(this.certificateEditionEvent, CertificateEditionEventType.CERTIFICATE_UPDATED,
          {certificate: x})
      )
      .finally(() => this.submitted = false);
  }

}
