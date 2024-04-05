/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService } from '@app/core';

import { Agency, InstrumentMediaContent, PaymentFields, PreprocessingData, ProvidedServiceType,
         RequestedServiceFields, Transaction, TransactionFields, TransactionQuery, TransactionDescriptor,
         TransactionType, WorkflowCommand, WorkflowTask, ApplicableCommand } from '@app/models';


@Injectable()
export class TransactionDataService {

  constructor(private http: HttpService) { }

  getAgencies(): EmpObservable<Agency[]> {
    const path = `v5/land/agencies`;

    return this.http.get<Agency[]>(path);
  }


  getAllAvailableCommandTypes(): EmpObservable<ApplicableCommand[]> {
    const path = `v5/land/workflow/all-command-types`;

    return this.http.get<ApplicableCommand[]>(path);
  }


  getApplicableCommands(transactionsUidList: string[]): EmpObservable<ApplicableCommand[]> {
    Assertion.assertValue(transactionsUidList, 'transactionsUidList');

    const path = `v5/land/workflow/applicable-command-types`;

    return this.http.post<ApplicableCommand[]>(path, transactionsUidList);
  }


  getProvidedServices(): EmpObservable<ProvidedServiceType[]> {
    const path = `v5/land/provided-services`;

    return this.http.get<ProvidedServiceType[]>(path);
  }


  getTransactionTypes(): EmpObservable<TransactionType[]> {
    const path = `v5/land/transaction-types`;

    return this.http.get<TransactionType[]>(path);
  }


  getTransactionPreprocessingData(transactionUID: string): EmpObservable<PreprocessingData> {
    Assertion.assertValue(transactionUID, 'transactionUID');

    const path = `v5/land/transactions/${transactionUID}/preprocessing-data`;

    return this.http.get<PreprocessingData>(path);
  }


  getTransaction(transactionUID: string): EmpObservable<Transaction> {
    Assertion.assertValue(transactionUID, 'transactionUID');

    const path = `v5/land/transactions/${transactionUID}`;

    return this.http.get<Transaction>(path);
  }


  searchTransactionsList(query: TransactionQuery): EmpObservable<TransactionDescriptor[]> {
    Assertion.assertValue(query, 'query');
    Assertion.assertValue(query.recorderOfficeUID, 'query.recorderOfficeUID');

    const path = `v5/land/transactions/search`;

    return this.http.post<TransactionDescriptor[]>(path, query);
  }


  getWorkflowHistoryForTransaction(transactionUID: string): EmpObservable<WorkflowTask> {
    Assertion.assertValue(transactionUID, 'transactionUID');

    const path = `v5/land/workflow/${transactionUID}/history`;

    return this.http.get<WorkflowTask>(path);
  }


  addTransactionService(transactionUID: string,
                        requestedService: RequestedServiceFields): EmpObservable<Transaction> {
    Assertion.assertValue(transactionUID, 'transactionUID');
    Assertion.assertValue(requestedService, 'requestedService');

    const path = `v5/land/transactions/${transactionUID}/requested-services`;

    return this.http.post<Transaction>(path, requestedService);
  }


  cancelPayment(transactionUID: string): EmpObservable<Transaction> {
    Assertion.assertValue(transactionUID, 'transactionUID');

    const path = `v5/land/transactions/${transactionUID}/cancel-payment`;

    return this.http.post<Transaction>(path);
  }


  cancelPaymentOrder(transactionUID: string): EmpObservable<Transaction> {
    Assertion.assertValue(transactionUID, 'transactionUID');

    const path = `v5/land/transactions/${transactionUID}/cancel-payment-order`;

    return this.http.post<Transaction>(path);
  }


  cloneTransaction(transactionUID: string): EmpObservable<Transaction> {
    Assertion.assertValue(transactionUID, 'transactionUID');

    const path = `v5/land/transactions/${transactionUID}/clone`;

    return this.http.post<Transaction>(path);
  }


  createTransaction(transaction: TransactionFields): EmpObservable<Transaction> {
    Assertion.assertValue(transaction, 'transaction');

    const path = `v5/land/transactions`;

    return this.http.post<Transaction>(path, transaction);
  }


  deleteTransaction(transactionUID: string): EmpObservable<Transaction> {
    Assertion.assertValue(transactionUID, 'transactionUID');

    const path = `v5/land/transactions/${transactionUID}`;

    return this.http.delete<Transaction>(path);
  }


  deleteTransactionService(transactionUID: string,
                           requestedServiceUID: string): EmpObservable<Transaction> {
    Assertion.assertValue(transactionUID, 'transactionUID');
    Assertion.assertValue(requestedServiceUID, 'requestedServiceUID');

    const path = `v5/land/transactions/${transactionUID}/requested-services/${requestedServiceUID}`;

    return this.http.delete<Transaction>(path);
  }


  executeWorkflowCommand(command: WorkflowCommand): EmpObservable<WorkflowTask[]> {
    Assertion.assertValue(command, 'command');

    const path = `v5/land/workflow/execute-command`;

    if (!command.payload.nextStatus) {
      command.payload.nextStatus = 'Undefined';
    }

    return this.http.post<WorkflowTask[]>(path, command);
  }


  generatePaymentOrder(transactionUID: string): EmpObservable<Transaction> {
    Assertion.assertValue(transactionUID, 'transactionUID');

    const path = `v5/land/transactions/${transactionUID}/generate-payment-order`;

    return this.http.post<Transaction>(path);
  }


  searchAndAssertCommandExecution(command: WorkflowCommand): EmpObservable<TransactionDescriptor> {
    Assertion.assertValue(command, 'command');

    const path = `v5/land/workflow/search-and-assert-command-execution`;

    return this.http.post<TransactionDescriptor>(path, command);
  }


  setPayment(transactionUID: string, payment: PaymentFields): EmpObservable<Transaction> {
    Assertion.assertValue(transactionUID, 'transactionUID');
    Assertion.assertValue(payment, 'payment');

    const path = `v5/land/transactions/${transactionUID}/set-payment`;

    return this.http.post<Transaction>(path, payment);
  }


  submitTransaction(transactionUID: string): EmpObservable<Transaction> {
    Assertion.assertValue(transactionUID, 'transactionUID');

    const path = `v5/land/transactions/${transactionUID}/submit`;

    return this.http.post<Transaction>(path);
  }


  updateTransaction(transactionUID: string,
                    transaction: TransactionFields): EmpObservable<Transaction> {
    Assertion.assertValue(transactionUID, 'transactionUID');
    Assertion.assertValue(transaction, 'transaction');

    const path = `v5/land/transactions/${transactionUID}`;

    return this.http.put<Transaction>(path, transaction);
  }


  uploadTransactionMediaFile(transactionUID: string,
                             file: File,
                             mediaContent: InstrumentMediaContent): EmpObservable<PreprocessingData> {
    Assertion.assertValue(transactionUID, 'transactionUID');
    Assertion.assertValue(file, 'file');
    Assertion.assertValue(mediaContent, 'mediaContent');

    const formData: FormData = new FormData();
    formData.append('media', file);
    formData.append('mediaContent', mediaContent);

    const path = `v5/land/transactions/${transactionUID}/media-files`;

    return this.http.post<PreprocessingData>(path, formData);
  }


  removeTransactionMediaFile(transactionUID: string, mediaFileUID: string): EmpObservable<PreprocessingData> {
    Assertion.assertValue(transactionUID, 'transactionUID');
    Assertion.assertValue(mediaFileUID, 'mediaFileUID');

    const path = `v5/land/transactions/${transactionUID}/media-files/${mediaFileUID}`;

    return this.http.delete<PreprocessingData>(path);
  }

}
