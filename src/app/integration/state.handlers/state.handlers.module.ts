/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { STATE_HANDLERS } from '@app/core/presentation/presentation.state';

import { MainUserInterfaceStateHandler } from './main-ui.state.handler';
import { ElectronicFilingStateHandler } from './electronic-filing.state.handler';
import { RepositoryStateHandler } from './repository.state.handler';



@NgModule({

  providers: [
    MainUserInterfaceStateHandler,
    ElectronicFilingStateHandler,
    RepositoryStateHandler,

    { provide: STATE_HANDLERS, useExisting: MainUserInterfaceStateHandler, multi: true },
    { provide: STATE_HANDLERS, useExisting: ElectronicFilingStateHandler, multi: true },
    { provide: STATE_HANDLERS, useExisting: RepositoryStateHandler, multi: true }

  ]

})
export class StateHandlersModule { }
