/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { STATE_HANDLERS } from '@app/core/presentation/presentation.state';

import { MainUserInterfaceStateHandler } from './main-ui.state.handler';
import { RecordingsStateHandler } from './recordings.state.handler';
import { InstrumentsStateHandler } from './instruments.state.handler';
import { InstrumentTypesStateHandler } from './instrument-types.state.handler';
import { RepositoryStateHandler } from './repository.state.handler';
import { TransactionStateHandler } from './transaction.state.handler';


@NgModule({

  providers: [
    MainUserInterfaceStateHandler,
    RecordingsStateHandler,
    InstrumentsStateHandler,
    InstrumentTypesStateHandler,
    RepositoryStateHandler,
    TransactionStateHandler,

    { provide: STATE_HANDLERS, useExisting: MainUserInterfaceStateHandler, multi: true },
    { provide: STATE_HANDLERS, useExisting: RecordingsStateHandler, multi: true },
    { provide: STATE_HANDLERS, useExisting: InstrumentsStateHandler, multi: true },
    { provide: STATE_HANDLERS, useExisting: InstrumentTypesStateHandler, multi: true },
    { provide: STATE_HANDLERS, useExisting: TransactionStateHandler, multi: true },
    { provide: STATE_HANDLERS, useExisting: RepositoryStateHandler, multi: true },
    { provide: STATE_HANDLERS, useExisting: TransactionStateHandler, multi: true },

  ]

})
export class StateHandlersModule { }
