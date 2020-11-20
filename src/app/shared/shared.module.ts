/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedContainersModule } from './containers/shared-containers.module';
import { SharedPipesModule } from './pipes/shared-pipes.module';
import { SharedFormControlsModule } from './form-controls/shared-form-controls.module';
import { SharedIndicatorsModule } from './indicators/shared-indicators.module';

@NgModule({

  imports: [
    CommonModule,

    SharedPipesModule,
    SharedContainersModule,
    SharedFormControlsModule,
    SharedIndicatorsModule
  ],

  declarations: [],

  exports: [
    SharedContainersModule,
    SharedFormControlsModule,
    SharedIndicatorsModule,
    SharedPipesModule
  ],

  providers: []

})
export class SharedModule { }
