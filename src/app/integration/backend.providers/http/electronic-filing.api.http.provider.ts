/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Assertion, HttpService } from '@app/core';

import { EFilingRequestApiProvider } from '@app/domain/providers';

import { EFilingRequest, FilingRequestStatusType,
         ProcedureType, Requester } from '@app/domain/entities';


@Injectable()
export class ElectronicFilingApiHttpProvider extends EFilingRequestApiProvider {

  constructor(private http: HttpService) {
    super();
  }


  getEFilingRequest(uid: string): Observable<EFilingRequest> {
    Assertion.assertValue(uid, 'uid');

    const path = `v2/electronic-filing/filing-requests/${uid}`;

    return this.http.get<EFilingRequest>(path);
  }


  getEFilingRequestList(status?: FilingRequestStatusType,
                        keywords?: string): Observable<EFilingRequest[]> {
    let path = `v2/electronic-filing/filing-requests`;

    if (status && keywords) {
      path += `/?status=${status}&keywords=${keywords}`;
    } else if (status && !keywords) {
      path += `/?status=${status}`;
    } else if (!status && keywords) {
      path += `/?keywords=${keywords}`;
    } else {
      // no-op
    }

    return this.http.get<EFilingRequest[]>(path);
  }


  // command methods


  createEFilingRequest(procedureType: ProcedureType,
                       requestedBy: Requester): Observable<EFilingRequest> {
    Assertion.assertValue(procedureType, 'procedureType');
    Assertion.assert(procedureType !== 'NoDeterminado', 'procedureType has an invalid value.');
    Assertion.assertValue(requestedBy, 'requestedBy');

    const path = `v2/electronic-filing/filing-requests`;

    const body = {
      procedureType,
      requestedBy
    };

    return this.http.post<EFilingRequest>(path, body);
  }


  deleteRequest(request: EFilingRequest): Promise<void> {
    Assertion.assertValue(request, 'request');

    const path = `v2/electronic-filing/filing-requests/${request.uid}`;

    return this.http.delete<void>(path)
                    .toPromise();
  }


  generatePaymentOrder(request: EFilingRequest): Observable<EFilingRequest> {
    Assertion.assertValue(request, 'request');

    const path = `v2/electronic-filing/filing-requests/${request.uid}/generate-payment-order`;

    return this.http.post<EFilingRequest>(path);
  }


  revokeEFilingRequestSign(request: EFilingRequest,
                           revokeSignToken: string) {
    Assertion.assertValue(request, 'request');
    Assertion.assertValue(revokeSignToken, 'revokeSignToken');

    const path = `v2/electronic-filing/filing-requests/${request.uid}/revoke-sign`;

    return this.http.post<EFilingRequest>(path, { revokeSignToken });
  }


  setPaymentReceipt(request: EFilingRequest,
                    receiptNo: string): Observable<EFilingRequest> {
    Assertion.assertValue(request, 'request');
    Assertion.assertValue(receiptNo, 'receiptNo');

    const path = `v2/electronic-filing/filing-requests/${request.uid}/set-payment-receipt`;

    return this.http.post<EFilingRequest>(path, { receiptNo });
  }


  signEFilingRequest(request: EFilingRequest,
                     signToken: string): Observable<EFilingRequest> {
    Assertion.assertValue(request, 'request');
    Assertion.assertValue(signToken, 'signToken');

    const path = `v2/electronic-filing/filing-requests/${request.uid}/sign`;

    return this.http.post<EFilingRequest>(path, { signToken });
  }


  submitEFilingRequest(request: EFilingRequest): Observable<EFilingRequest> {
    Assertion.assertValue(request, 'request');

    const path = `v2/electronic-filing/filing-requests/${request.uid}/submit`;

    return this.http.post<EFilingRequest>(path);
  }


  updateApplicationForm(request: EFilingRequest, form: any): Observable<EFilingRequest> {
    Assertion.assertValue(request, 'request');
    Assertion.assertValue(form, 'form');

    const path = `v2/electronic-filing/filing-requests/${request.uid}/update-application-form`;

    return this.http.put<EFilingRequest>(path, form);
  }


  updateEFilingRequest(request: Partial<EFilingRequest>,
                       requestedBy: Requester): Observable<EFilingRequest> {
    Assertion.assertValue(request, 'request');
    Assertion.assertValue(request.uid, 'request.uid');
    Assertion.assertValue(requestedBy, 'requestedBy');

    const path = `v2/electronic-filing/filing-requests/${request.uid}`;

    return this.http.put<EFilingRequest>(path, requestedBy);
  }

}
