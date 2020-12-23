/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { STATE_HANDLERS } from '@app/core/presentation/presentation.state';

import { MainUserInterfaceStateHandler } from './main-ui.state.handler';
import { DocumentsRecordingStateHandler } from './documents-recording.state.handler';
import { InstrumentsStateHandler } from './instruments.state.handler';
import { InstrumentTypesStateHandler } from './instrument-types.state.handler';
import { IssuersStateHandler } from './issuers.state.handler';
import { RepositoryStateHandler } from './repository.state.handler';
import { TransactionStateHandler } from './transaction.state.handler';


@NgModule({

  providers: [
    MainUserInterfaceStateHandler,
    DocumentsRecordingStateHandler,
    InstrumentsStateHandler,
    InstrumentTypesStateHandler,
    IssuersStateHandler,
    RepositoryStateHandler,
    TransactionStateHandler,

    { provide: STATE_HANDLERS, useExisting: MainUserInterfaceStateHandler, multi: true },
    { provide: STATE_HANDLERS, useExisting: DocumentsRecordingStateHandler, multi: true },
    { provide: STATE_HANDLERS, useExisting: InstrumentsStateHandler, multi: true },
    { provide: STATE_HANDLERS, useExisting: InstrumentTypesStateHandler, multi: true },
    { provide: STATE_HANDLERS, useExisting: IssuersStateHandler, multi: true },
    { provide: STATE_HANDLERS, useExisting: TransactionStateHandler, multi: true },
    { provide: STATE_HANDLERS, useExisting: RepositoryStateHandler, multi: true },
    { provide: STATE_HANDLERS, useExisting: TransactionStateHandler, multi: true },

  ]

})
export class StateHandlersModule { }
