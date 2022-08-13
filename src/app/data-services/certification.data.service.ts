/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Assertion, HttpService } from '@app/core';

import { Certificate, CertificateType, CreateCertificateCommand } from '@app/models';


@Injectable()
export class CertificationDataService {

  constructor(private http: HttpService) { }


  getTransactionCertificateTypes(transactionUID: string): Observable<CertificateType[]> {
    Assertion.assertValue(transactionUID, 'transactionUID');

    const path = `v5/land/transactions/${transactionUID}/certificates/certificate-types`;

    return this.http.get<CertificateType[]>(path);
  }


  getTransactionCertificates(transactionUID: string): Observable<Certificate[]> {
    Assertion.assertValue(transactionUID, 'transactionUID');

    const path = `v5/land/transactions/${transactionUID}/certificates`;

    return this.http.get<Certificate[]>(path);
  }


  createCertificate(transactionUID: string, command: CreateCertificateCommand): Observable<Certificate> {
    Assertion.assertValue(transactionUID, 'transactionUID');
    Assertion.assertValue(command, 'command');

    const path = `v5/land/transactions/${transactionUID}/certificates`;

    return this.http.post<Certificate>(path, command);
  }


  closeCertificate(transactionUID: string, certificateUID: string): Observable<Certificate> {
    Assertion.assertValue(transactionUID, 'transactionUID');
    Assertion.assertValue(certificateUID, 'certificateUID');

    const path = `v5/land/transactions/${transactionUID}/certificates/${certificateUID}/close`;

    return this.http.post<Certificate>(path);
  }


  openCertificate(transactionUID: string, certificateUID: string): Observable<Certificate> {
    Assertion.assertValue(transactionUID, 'transactionUID');
    Assertion.assertValue(certificateUID, 'certificateUID');

    const path = `v5/land/transactions/${transactionUID}/certificates/${certificateUID}/open`;

    return this.http.post<Certificate>(path);
  }


  deleteCertificate(transactionUID: string, certificateUID: string): Observable<void> {
    Assertion.assertValue(transactionUID, 'transactionUID');
    Assertion.assertValue(certificateUID, 'certificateUID');

    const path = `v5/land/transactions/${transactionUID}/certificates/${certificateUID}`;

    return this.http.delete<void>(path);
  }

}
