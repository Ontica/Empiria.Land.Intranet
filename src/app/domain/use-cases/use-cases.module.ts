/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { BackendProvidersModule } from '@app/integration/backend.providers/backend.providers.module';
import { DocumentsRecordingUseCases } from './documents-recording.use-cases';

import { RepositoryUseCases } from './repository.use-cases';
import { TransactionUseCases } from './transaction.use-cases';


@NgModule({

  imports: [
    BackendProvidersModule
  ],

  providers: [
    DocumentsRecordingUseCases,
    TransactionUseCases,
    RepositoryUseCases,
  ]

})
export class UseCasesModule { }
