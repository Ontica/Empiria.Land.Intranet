/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Assertion, HttpService } from '@app/core';

import { ESignCommand, ESignCredentials, ESignRequestsQuery, TransactionDescriptor } from '@app/models';

import { Cryptography } from '@app/core/security/cryptography';

@Injectable()
export class ESignDataService {


  constructor(private http: HttpService) { }


  searchESignRequestedTransactions(query: ESignRequestsQuery): Observable<TransactionDescriptor[]> {
    Assertion.assertValue(query, 'query');

    const path = `v5/land/electronic-sign/requests/transactions/mine`;

    return this.http.post<TransactionDescriptor[]>(path, query);
  }


  async signMyTransactionDocuments(command: ESignCommand): Promise<void> {
    Assertion.assertValue(command, 'command');
    Assertion.assertValue(command.commandType, 'command.commandType');
    Assertion.assertValue(command.transactionUIDs, 'command.transactionUIDs');
    Assertion.assertValue(command.credentials.userID, 'command.credentials.userID');

    const credentials: ESignCredentials = {
      userID: command.credentials.userID,
      password: '',
    };

    const token = await
      this.http.post<string>('v5/land/electronic-sign/generate-esign-command-security-token', credentials)
               .toPromise();

    credentials.password = Cryptography.encryptAES2(command.credentials.password, token);

    command.credentials = credentials;

    return this.http.post<void>('v5/land/electronic-sign/execute-task/transactions/mine/sign', command)
      .toPromise();
  }

}
