/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService } from '@app/core';

import { ESignCommand, ESignCredentials, ESignRequestsQuery, TransactionDescriptor } from '@app/models';

import { Cryptography } from '@app/core/security/cryptography';

@Injectable()
export class ESignDataService {


  constructor(private http: HttpService) { }


  searchESignRequestedTransactions(query: ESignRequestsQuery): EmpObservable<TransactionDescriptor[]> {
    Assertion.assertValue(query, 'query');

    const path = `v5/land/electronic-sign/requests/transactions/mine`;

    return this.http.post<TransactionDescriptor[]>(path, query);
  }


  async signMyTransactionDocuments(command: ESignCommand): Promise<void> {
    Assertion.assertValue(command, 'command');
    Assertion.assertValue(command.commandType, 'command.commandType');
    Assertion.assertValue(command.credentials, 'command.credentials');
    Assertion.assertValue(command.transactionUIDs, 'command.transactionUIDs');

    command.credentials = await
      this.generateCredentialsWithToken(command.credentials.userID, command.credentials.password);

    return this.http.post<void>('v5/land/electronic-sign/execute-task/transactions/mine/sign', command)
      .firstValue();
  }


  async revokeMyTransactionDocuments(command: ESignCommand): Promise<void> {
    Assertion.assertValue(command, 'command');
    Assertion.assertValue(command.commandType, 'command.commandType');
    Assertion.assertValue(command.credentials, 'command.credentials');
    Assertion.assertValue(command.transactionUIDs, 'command.transactionUIDs');

    command.credentials = await
      this.generateCredentialsWithToken(command.credentials.userID, command.credentials.password);

    return this.http.post<void>('v5/land/electronic-sign/execute-task/transactions/mine/revoke', command)
      .firstValue();
  }


  async refuseMyTransactionDocuments(command: ESignCommand): Promise<void> {
    Assertion.assertValue(command, 'command');
    Assertion.assertValue(command.commandType, 'command.commandType');
    Assertion.assertValue(command.credentials, 'command.credentials');
    Assertion.assertValue(command.transactionUIDs, 'command.transactionUIDs');

    command.credentials = await
      this.generateCredentialsWithToken(command.credentials.userID, command.credentials.password);

    return this.http.post<void>('v5/land/electronic-sign/execute-task/transactions/mine/refuse', command)
      .firstValue();
  }


  async unrefuseMyTransactionDocuments(command: ESignCommand): Promise<void> {
    Assertion.assertValue(command, 'command');
    Assertion.assertValue(command.commandType, 'command.commandType');
    Assertion.assertValue(command.credentials, 'command.credentials');
    Assertion.assertValue(command.transactionUIDs, 'command.transactionUIDs');

    command.credentials = await
      this.generateCredentialsWithToken(command.credentials.userID, command.credentials.password);

    return this.http.post<void>('v5/land/electronic-sign/execute-task/transactions/mine/unrefuse', command)
      .firstValue();
  }


  async generateCredentialsWithToken(userUID: string, password: string): Promise<ESignCredentials> {
    Assertion.assertValue(userUID, 'userUID');
    Assertion.assertValue(password, 'password');

    const credentials: ESignCredentials = {
      userID: userUID,
      password: '',
    };

    const token = await
      this.http.post<string>('v5/land/electronic-sign/generate-esign-command-security-token', credentials)
        .firstValue();

    credentials.password = Cryptography.encryptAES2(password, token);

    return credentials;
  }

}
