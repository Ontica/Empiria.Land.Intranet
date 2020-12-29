/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { FrontController } from './front.controller';
import { PresentationLayer } from './presentation-layer';
import { PresentationState } from './presentation.state';

import { CommandHandlersModule } from '@app/presentation/command.handlers/command.handlers.module';

import { StateHandlersModule } from '@app/presentation/state.handlers/state.handlers.module';



@NgModule({

  imports: [
    CommandHandlersModule,
    StateHandlersModule
  ],

  providers: [
    FrontController,
    PresentationLayer,
    PresentationState
  ]

})
export class PresentationModule { }
