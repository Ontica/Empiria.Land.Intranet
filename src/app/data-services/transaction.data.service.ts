/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Assertion, HttpService, Identifiable } from '@app/core';

import { Agency, InstrumentMediaContent, PaymentFields, PreprocessingData, ProvidedServiceType,
         RecordingSection, RequestedServiceFields, Transaction, TransactionFields, TransactionQuery,
         TransactionDescriptor, TransactionType, WorkflowCommand, WorkflowTask,
         ApplicableCommand } from '@app/models';


@Injectable()
export class TransactionDataService {

  constructor(private http: HttpService) { }

  getAgencies(): Observable<Agency[]> {
    const path = `v5/land/agencies`;

    return this.http.get<Agency[]>(path);
  }


  getAllAvailableCommandTypes(): Observable<ApplicableCommand[]> {
    const path = `v5/land/workflow/all-command-types`;

    return this.http.get<ApplicableCommand[]>(path);
  }


  getApplicableCommands(transactionsUidList: string[]): Observable<ApplicableCommand[]> {
    Assertion.assertValue(transactionsUidList, 'transactionsUidList');

    const path = `v5/land/workflow/applicable-command-types`;

    return this.http.post<ApplicableCommand[]>(path, transactionsUidList);
  }


  getProvidedServices(): Observable<ProvidedServiceType[]> {
    const path = `v5/land/provided-services`;

    return this.http.get<ProvidedServiceType[]>(path);
  }


  getTransactionTypes(): Observable<TransactionType[]> {
    const path = `v5/land/transaction-types`;

    return this.http.get<TransactionType[]>(path);
  }


  getTransactionPreprocessingData(transactionUID: string): Observable<PreprocessingData> {
    Assertion.assertValue(transactionUID, 'transactionUID');

    const path = `v5/land/transactions/${transactionUID}/preprocessing-data`;

    return this.http.get<PreprocessingData>(path);
  }


  getTransaction(transactionUID: string): Observable<Transaction> {
    Assertion.assertValue(transactionUID, 'transactionUID');

    const path = `v5/land/transactions/${transactionUID}`;

    return this.http.get<Transaction>(path);
  }


  searchTransactionsList(query: TransactionQuery): Observable<TransactionDescriptor[]> {
    Assertion.assertValue(query, 'query');
    Assertion.assertValue(query.recorderOfficeUID, 'query.recorderOfficeUID');

    const path = `v5/land/transactions/search`;

    return this.http.post<TransactionDescriptor[]>(path, query);
  }


  getWorkflowHistoryForTransaction(transactionUID: string): Observable<WorkflowTask> {
    Assertion.assertValue(transactionUID, 'transactionUID');

    const path = `v5/land/workflow/${transactionUID}/history`;

    return this.http.get<WorkflowTask>(path);
  }


  addTransactionService(transactionUID: string,
                        requestedService: RequestedServiceFields): Observable<Transaction> {
    Assertion.assertValue(transactionUID, 'transactionUID');
    Assertion.assertValue(requestedService, 'requestedService');

    const path = `v5/land/transactions/${transactionUID}/requested-services`;

    return this.http.post<Transaction>(path, requestedService);
  }


  cancelPayment(transactionUID: string): Observable<Transaction> {
    Assertion.assertValue(transactionUID, 'transactionUID');

    const path = `v5/land/transactions/${transactionUID}/cancel-payment`;

    return this.http.post<Transaction>(path);
  }


  cancelPaymentOrder(transactionUID: string): Observable<Transaction> {
    Assertion.assertValue(transactionUID, 'transactionUID');

    const path = `v5/land/transactions/${transactionUID}/cancel-payment-order`;

    return this.http.post<Transaction>(path);
  }


  cloneTransaction(transactionUID: string): Observable<Transaction> {
    Assertion.assertValue(transactionUID, 'transactionUID');

    const path = `v5/land/transactions/${transactionUID}/clone`;

    return this.http.post<Transaction>(path);
  }


  createTransaction(transaction: TransactionFields): Observable<Transaction> {
    Assertion.assertValue(transaction, 'transaction');

    const path = `v5/land/transactions`;

    return this.http.post<Transaction>(path, transaction);
  }


  deleteTransaction(transactionUID: string): Observable<Transaction> {
    Assertion.assertValue(transactionUID, 'transactionUID');

    const path = `v5/land/transactions/${transactionUID}`;

    return this.http.delete<Transaction>(path);
  }


  deleteTransactionService(transactionUID: string,
                           requestedServiceUID: string): Observable<Transaction> {
    Assertion.assertValue(transactionUID, 'transactionUID');
    Assertion.assertValue(requestedServiceUID, 'requestedServiceUID');

    const path = `v5/land/transactions/${transactionUID}/requested-services/${requestedServiceUID}`;

    return this.http.delete<Transaction>(path);
  }


  executeWorkflowCommand(command: WorkflowCommand): Observable<WorkflowTask[]> {
    Assertion.assertValue(command, 'command');

    const path = `v5/land/workflow/execute-command`;

    if (!command.payload.nextStatus) {
      command.payload.nextStatus = 'Undefined';
    }

    return this.http.post<WorkflowTask[]>(path, command);
  }


  generatePaymentOrder(transactionUID: string): Observable<Transaction> {
    Assertion.assertValue(transactionUID, 'transactionUID');

    const path = `v5/land/transactions/${transactionUID}/generate-payment-order`;

    return this.http.post<Transaction>(path);
  }


  searchAndAssertCommandExecution(command: WorkflowCommand): Observable<TransactionDescriptor> {
    Assertion.assertValue(command, 'command');

    const path = `v5/land/workflow/search-and-assert-command-execution`;

    return this.http.post<TransactionDescriptor>(path, command);
  }


  setPayment(transactionUID: string, payment: PaymentFields): Observable<Transaction> {
    Assertion.assertValue(transactionUID, 'transactionUID');
    Assertion.assertValue(payment, 'payment');

    const path = `v5/land/transactions/${transactionUID}/set-payment`;

    return this.http.post<Transaction>(path, payment);
  }


  submitTransaction(transactionUID: string): Observable<Transaction> {
    Assertion.assertValue(transactionUID, 'transactionUID');

    const path = `v5/land/transactions/${transactionUID}/submit`;

    return this.http.post<Transaction>(path);
  }


  updateTransaction(transactionUID: string,
                    transaction: TransactionFields): Observable<Transaction> {
    Assertion.assertValue(transactionUID, 'transactionUID');
    Assertion.assertValue(transaction, 'transaction');

    const path = `v5/land/transactions/${transactionUID}`;

    return this.http.put<Transaction>(path, transaction);
  }


  uploadTransactionMediaFile(transactionUID: string,
                             file: File,
                             mediaContent: InstrumentMediaContent): Observable<PreprocessingData> {
    Assertion.assertValue(transactionUID, 'transactionUID');
    Assertion.assertValue(file, 'file');
    Assertion.assertValue(mediaContent, 'mediaContent');

    const formData: FormData = new FormData();
    formData.append('media', file);
    formData.append('mediaContent', mediaContent);

    const path = `v5/land/transactions/${transactionUID}/media-files`;

    return this.http.post<PreprocessingData>(path, formData);
  }


  removeTransactionMediaFile(transactionUID: string, mediaFileUID: string): Observable<PreprocessingData> {
    Assertion.assertValue(transactionUID, 'transactionUID');
    Assertion.assertValue(mediaFileUID, 'mediaFileUID');

    const path = `v5/land/transactions/${transactionUID}/media-files/${mediaFileUID}`;

    return this.http.delete<PreprocessingData>(path);
  }

}
