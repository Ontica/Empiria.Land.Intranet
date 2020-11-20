/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { EFilingRequestApiProvider } from '@app/domain/providers/electronic-filing.api.provider';
import { RepositoryApiProvider } from '@app/domain/providers/repository.api.provider';

import { ElectronicFilingApiHttpProvider } from './http/electronic-filing.api.http.provider';
import { RepositoryApiHttpProvider } from './http/repository.api.http.provider';


@NgModule({

  providers: [
    { provide: EFilingRequestApiProvider, useClass: ElectronicFilingApiHttpProvider },
    { provide: RepositoryApiProvider, useClass: RepositoryApiHttpProvider }
  ]

})
export class BackendProvidersModule { }
