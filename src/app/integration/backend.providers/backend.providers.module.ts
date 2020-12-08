/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { DocumentsRecordingApiProvider } from '@app/domain/providers';
import { TransactionApiProvider } from '@app/domain/providers/transaction.api.provider';
import { RepositoryApiProvider } from '@app/domain/providers/repository.api.provider';

import { DocumentsRecordingApiHttpProvider } from './http/documents-recording.api.http.provider';
import { TransactionApiHttpProvider } from './http/transaction.api.http.provider';
import { RepositoryApiHttpProvider } from './http/repository.api.http.provider';


@NgModule({

  providers: [
    { provide: DocumentsRecordingApiProvider, useClass: DocumentsRecordingApiHttpProvider },
    { provide: TransactionApiProvider, useClass: TransactionApiHttpProvider },
    { provide: RepositoryApiProvider, useClass: RepositoryApiHttpProvider }
  ]

})
export class BackendProvidersModule { }
