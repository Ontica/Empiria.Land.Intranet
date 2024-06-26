/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { STATE_HANDLERS } from '@app/core/presentation/presentation.state';

import { MainLayoutPresentationHandler } from './main-layout/main-layout.presentation.handler';

import { AppStatusPresentationHandler } from './app-data/app-status.presentation.handler';

import { AccessControlPresentationHandler } from './security-management/access-control.presentation.handler';

import { RecordableSubjectsPresentationHandler } from './land/recordable-subjects.presentation.handler';

import { RegistrationPresentationHandler } from './land/registration.presentation.handler';

import { TransactionPresentationHandler } from './land/transaction.presentation.handler';


@NgModule({

  providers: [
    MainLayoutPresentationHandler,
    AppStatusPresentationHandler,
    AccessControlPresentationHandler,

    RecordableSubjectsPresentationHandler,
    RegistrationPresentationHandler,
    TransactionPresentationHandler,

    { provide: STATE_HANDLERS, useExisting: MainLayoutPresentationHandler, multi: true },
    { provide: STATE_HANDLERS, useExisting: AppStatusPresentationHandler, multi: true },
    { provide: STATE_HANDLERS, useExisting: AccessControlPresentationHandler, multi: true },
    { provide: STATE_HANDLERS, useExisting: RecordableSubjectsPresentationHandler, multi: true },
    { provide: STATE_HANDLERS, useExisting: RegistrationPresentationHandler, multi: true },
    { provide: STATE_HANDLERS, useExisting: TransactionPresentationHandler, multi: true },
  ]

})
export class StateHandlersModule { }
