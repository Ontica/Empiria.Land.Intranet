/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { DocumentsRecordingApiProvider } from '@app/domain/providers';
import { InstrumentTypesApiProvider } from '@app/domain/providers/instrument-types.api.provider';
import { InstrumentsApiProvider } from '@app/domain/providers/instruments.api.provider';
import { IssuersApiProvider } from '@app/domain/providers/issuers.api.provider';
import { RepositoryApiProvider } from '@app/domain/providers/repository.api.provider';
import { TransactionApiProvider } from '@app/domain/providers/transaction.api.provider';

import { DocumentsRecordingApiHttpProvider } from './http/documents-recording.api.http.provider';
import { InstrumentsApiHttpProvider } from './http/instruments.api.http.provider';
import { InstrumentTypesApiHttpProvider } from './http/instrument-types.api.http.provider';
import { IssuersApiHttpProvider } from './http/issuers.api.http.provider';
import { RepositoryApiHttpProvider } from './http/repository.api.http.provider';
import { TransactionApiHttpProvider } from './http/transaction.api.http.provider';


@NgModule({

  providers: [
    { provide: DocumentsRecordingApiProvider, useClass: DocumentsRecordingApiHttpProvider },
    { provide: InstrumentTypesApiProvider, useClass: InstrumentTypesApiHttpProvider },
    { provide: InstrumentsApiProvider, useClass: InstrumentsApiHttpProvider },
    { provide: IssuersApiProvider, useClass: IssuersApiHttpProvider },
    { provide: RepositoryApiProvider, useClass: RepositoryApiHttpProvider },
    { provide: TransactionApiProvider, useClass: TransactionApiHttpProvider },
  ]

})
export class BackendProvidersModule { }
