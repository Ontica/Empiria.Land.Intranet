/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { COMMAND_HANDLERS } from '@app/core/presentation/front.controller';

import { ElectronicFilingCommandHandler } from './electronic-filing.command.handler';
import { TransactionCommandHandler } from './transaction.command.handler';


@NgModule({

  providers: [
    ElectronicFilingCommandHandler,
    TransactionCommandHandler,

    { provide: COMMAND_HANDLERS, useExisting: ElectronicFilingCommandHandler, multi: true },
    { provide: COMMAND_HANDLERS, useExisting: TransactionCommandHandler, multi: true }

  ]

})
export class CommandHandlersModule { }
