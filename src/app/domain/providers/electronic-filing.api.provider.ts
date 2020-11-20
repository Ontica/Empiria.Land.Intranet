/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Observable } from 'rxjs';

import { EFilingRequest, FilingRequestStatusType,
         ProcedureType, Requester } from '@app/domain/entities';


export abstract class EFilingRequestApiProvider {


  abstract getEFilingRequest(uid: string): Observable<EFilingRequest>;


  abstract getEFilingRequestList(status?: FilingRequestStatusType,
                                 keywords?: string): Observable<EFilingRequest[]>;

  // command methods


  abstract createEFilingRequest(procedureType: ProcedureType,
                                requestedBy: Requester): Observable<EFilingRequest>;


  abstract deleteRequest(request: EFilingRequest): Promise<void>;


  abstract generatePaymentOrder(request: EFilingRequest): Observable<EFilingRequest>;



  abstract revokeEFilingRequestSign(request: EFilingRequest,
                                    revokeSignToken: string);


  abstract setPaymentReceipt(request: EFilingRequest,
                             receiptNo: string): Observable<EFilingRequest>;


  abstract signEFilingRequest(request: EFilingRequest,
                              signToken: string): Observable<EFilingRequest>;


  abstract submitEFilingRequest(request: EFilingRequest): Observable<EFilingRequest>;


  abstract updateApplicationForm(request: EFilingRequest, form: any): Observable<EFilingRequest>;


  abstract updateEFilingRequest(request: EFilingRequest,
                                requestedBy: Requester): Observable<EFilingRequest>;

}
