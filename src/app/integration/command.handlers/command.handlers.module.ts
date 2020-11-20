/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { COMMAND_HANDLERS } from '@app/core/presentation/front.controller';

import { ElectronicFilingCommandHandler } from './electronic-filing.command.handler';


@NgModule({

  providers: [
    ElectronicFilingCommandHandler,

    { provide: COMMAND_HANDLERS, useExisting: ElectronicFilingCommandHandler, multi: true }
  ]

})
export class CommandHandlersModule { }
