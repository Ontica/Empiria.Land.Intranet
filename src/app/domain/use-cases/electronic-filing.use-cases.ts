/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Assertion } from '@app/core';

import { EFilingRequestApiProvider } from '../providers';

import { EFilingRequest, EFilingRequestFilter, Requester, ProcedureType } from '@app/domain/models';


@Injectable()
export class ElectronicFilingUseCases {


  constructor(private backend: EFilingRequestApiProvider) { }


  getRequests(filter: EFilingRequestFilter): Observable<EFilingRequest[]> {
    Assertion.assertValue(filter, 'filter');

    return this.backend.getEFilingRequestList(filter.status, filter.keywords);
  }


  // update methods


  createRequest(procedureType: ProcedureType, requestedBy: Requester): Observable<EFilingRequest> {
    Assertion.assertValue(procedureType, 'procedureType');
    Assertion.assert(procedureType !== 'NoDeterminado', 'procedureType has an invalid value.');
    Assertion.assertValue(requestedBy, 'requestedBy');

    return this.backend.createEFilingRequest(procedureType, requestedBy);
  }


  deleteRequest(request: EFilingRequest): Promise<void> {
    Assertion.assertValue(request, 'request');

    return this.backend.deleteRequest(request);
  }


  generatePaymentOrder(request: EFilingRequest): Observable<EFilingRequest> {
    Assertion.assertValue(request, 'request');

    return this.backend.generatePaymentOrder(request);
  }


  revokeRequestSign(request: EFilingRequest,
                    revocationToken: string): Observable<EFilingRequest> {
    Assertion.assertValue(request, 'request');
    Assertion.assertValue(revocationToken, 'revocationToken');

    return this.backend.revokeEFilingRequestSign(request, revocationToken);
  }


  setPaymentReceipt(request: EFilingRequest,
                    receiptNo: string): Observable<EFilingRequest> {
    Assertion.assertValue(request, 'request');
    Assertion.assertValue(receiptNo, 'receiptNo');

    return this.backend.setPaymentReceipt(request, receiptNo);
  }


  signRequest(request: EFilingRequest,
              signToken: string): Observable<EFilingRequest> {
    Assertion.assertValue(request, 'request');
    Assertion.assertValue(signToken, 'signToken');

    return this.backend.signEFilingRequest(request, signToken);
  }


  submitRequest(request: EFilingRequest): Observable<EFilingRequest> {
    Assertion.assertValue(request, 'request');

    return this.backend.submitEFilingRequest(request);
  }


  updateApplicationForm(request: EFilingRequest, form: any): Observable<EFilingRequest> {
    Assertion.assertValue(request, 'request');
    Assertion.assertValue(form, 'form');

    return this.backend.updateApplicationForm(request, form);
  }


  updateRequest(request: EFilingRequest, requestedBy: Requester): Observable<EFilingRequest> {
    Assertion.assertValue(request, 'request');
    Assertion.assertValue(requestedBy, 'requestedBy');

    return this.backend.updateEFilingRequest(request, requestedBy);
  }

}
