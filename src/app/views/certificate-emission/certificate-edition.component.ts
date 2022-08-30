/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { EventInfo, MediaType, StringLibrary } from '@app/core';

import { CertificationDataService } from '@app/data-services';

import { Certificate, EmptyCertificate } from '@app/models';

import { MessageBoxService } from '@app/shared/containers/message-box';

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
              private messageBox: MessageBoxService) { }


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
      .toPromise()
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
      .toPromise()
      .then(x => {
        if (x) this.openCertificate();
      });
  }


  onPrintMediaClicked() {
    this.openMediaLinkWindowToPrint();
  }


  private setCardHint() {
    this.hint = `<strong>${this.certificate.type}</strong>` +
      ` &nbsp; &nbsp; | &nbsp; &nbsp; <strong> ${this.certificate.certificateID} </strong>` +
      ` &nbsp; &nbsp; | &nbsp; &nbsp; ${this.certificate.recordableSubject.electronicID}`;
  }


  private openMediaLinkWindowToPrint() {
    if (StringLibrary.isValidHttpUrl(this.certificate.mediaLink.url || '')) {
      const width = 900;
      const height = 600;
      const top = Math.floor((screen.height / 2) - (height / 2));
      const left = Math.floor((screen.width / 2) - (width / 2));
      window.open(this.certificate.mediaLink.url, '_blank',
        `resizable=yes,width=${width},height=${height},top=${top},left=${left}`);
    }
  }


  private closeCertificate() {
    this.submitted = true;

    this.certificationData.closeCertificate(this.transactionUID, this.certificate.uid)
      .toPromise()
      .then(x =>
          sendEvent(this.certificateEditionEvent, CertificateEditionEventType.CERTIFICATE_UPDATED,
            {certificate: x})
        )
      .finally(() => this.submitted = false);
  }


  private openCertificate() {
    this.submitted = true;

    this.certificationData.openCertificate(this.transactionUID, this.certificate.uid)
      .toPromise()
      .then(x =>
        sendEvent(this.certificateEditionEvent, CertificateEditionEventType.CERTIFICATE_UPDATED,
          {certificate: x})
      )
      .finally(() => this.submitted = false);
  }

}
