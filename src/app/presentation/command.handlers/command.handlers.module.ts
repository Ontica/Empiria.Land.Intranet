/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { COMMAND_HANDLERS } from '@app/core/presentation/front.controller';

import { InstrumentsCommandHandler } from './instruments.command.handler';
import { TransactionCommandHandler } from './transaction.command.handler';


@NgModule({

  providers: [
    TransactionCommandHandler,
    InstrumentsCommandHandler,

    { provide: COMMAND_HANDLERS, useExisting: InstrumentsCommandHandler, multi: true },
    { provide: COMMAND_HANDLERS, useExisting: TransactionCommandHandler, multi: true }

  ]

})
export class CommandHandlersModule { }
