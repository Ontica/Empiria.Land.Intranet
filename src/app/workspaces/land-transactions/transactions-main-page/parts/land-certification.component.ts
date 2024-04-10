/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { Assertion, Empty, EventInfo, Identifiable, isEmpty } from '@app/core';

import { PresentationLayer } from '@app/core/presentation';

import { RegistrationAction } from '@app/presentation/exported.presentation.types';

import { CertificationDataService } from '@app/data-services';

import { Certificate, CreateCertificateCommand, EmptyCertificate } from '@app/models';

import { MessageBoxService } from '@app/shared/containers/message-box';

import {
  CertificateCreatorEventType
} from '@app/views/certificate-emission/certificate-creator.component';

import {
  CertificateEditionEventType
} from '@app/views/certificate-emission/certificate-edition.component';

import {
  CertificateListEventType
} from '@app/views/certificate-emission/certificate-list.component';


@Component({
  selector: 'emp-land-certification',
  templateUrl: './land-certification.component.html',
})
export class LandCertificationComponent implements OnChanges {

  @Input() transactionUID = '';

  @Input() recorderOffice: Identifiable = Empty;

  certificatesList: Certificate[] = [];

  certificateSelected: Certificate = EmptyCertificate;

  displayCertificateEditor = false;

  panelAddState = false;

  isLoading = false;

  submitted = false;


  constructor(private uiLayer: PresentationLayer,
              private certificationData: CertificationDataService,
              private messageBox: MessageBoxService) { }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.transactionUID) {
      this.getTransactionCertificates();
      this.resetPanelState();
    }
  }


  onCertificateCreatorEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type as CertificateCreatorEventType) {
      case CertificateCreatorEventType.CREATE_CERTIFICATE:
        Assertion.assertValue(event.payload.transactionUID, 'event.payload.transactionUID');
        Assertion.assertValue(event.payload.command, 'event.payload.command');

        this.createCertificate(event.payload.transactionUID,
                               event.payload.command as CreateCertificateCommand);

        return;

      default:
        throw Assertion.assertNoReachThisCode(`Unrecoginzed event ${event.type}.`);
    }
  }


  onCertificateListEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type as CertificateListEventType) {
      case CertificateListEventType.SELECT_CERTIFICATE:
        Assertion.assertValue(event.payload.certificate, 'event.payload.certificate');

        this.setCertificateSelected(event.payload.certificate as Certificate);

        return;

      case CertificateListEventType.REMOVE_CERTIFICATE:
        Assertion.assertValue(event.payload.transactionUID, 'event.payload.transactionUID');
        Assertion.assertValue(event.payload.certificateUID, 'event.payload.certificateUID');

        this.deleteCertificate(event.payload.transactionUID, event.payload.certificateUID);

        return;

      case CertificateListEventType.SELECT_RECORDABLE_SUBJECT:
        Assertion.assertValue(event.payload.instrumentRecordingUID, 'event.payload.instrumentRecordingUID');
        Assertion.assertValue(event.payload.recordingActUID, 'event.payload.recordingActUID');

        this.uiLayer.dispatch(RegistrationAction.SELECT_REGISTRY_ENTRY, event.payload );
        return;

      default:
        throw Assertion.assertNoReachThisCode(`Unrecoginzed event ${event.type}.`);
    }
  }


  onCertificateEditionEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type as CertificateEditionEventType) {
      case CertificateEditionEventType.CLOSE_MODAL_CLICKED:
        this.setCertificateSelected(EmptyCertificate);

        return;

      case CertificateEditionEventType.CERTIFICATE_UPDATED:
        Assertion.assertValue(event.payload.certificate, 'event.payload.certificate');

        this.setCertificateSelected(EmptyCertificate);
        this.refreshData();

        return;

      default:
        throw Assertion.assertNoReachThisCode(`Unrecoginzed event ${event.type}.`);
    }
  }


  private getTransactionCertificates() {
    this.isLoading = true;

    this.certificationData.getTransactionCertificates(this.transactionUID)
      .firstValue()
      .then(x => this.certificatesList = x)
      .finally(() => this.isLoading = false);
  }


  private createCertificate(transactionUID: string, command: CreateCertificateCommand) {
    this.submitted = true;

    this.certificationData.createCertificate(transactionUID, command)
      .firstValue()
      .then(x => this.refreshData())
      .finally(() => this.submitted = false);
  }


  private deleteCertificate(transactionUID: string, certificateUID: string) {
    this.submitted = true;

    this.certificationData.deleteCertificate(transactionUID, certificateUID)
      .firstValue()
      .then(x =>{
        this.messageBox.show('El certificado fue eliminado correctamente.', 'Eliminar certificado');
        this.refreshData();
      })
      .finally(() => this.submitted = false);
  }


  private refreshData() {
    this.resetPanelState();
    this.getTransactionCertificates();
  }


  private resetPanelState() {
    this.panelAddState = false;
  }


  private setCertificateSelected(certificate: Certificate) {
    this.certificateSelected = certificate;
    this.displayCertificateEditor = !isEmpty(this.certificateSelected);
  }

}
