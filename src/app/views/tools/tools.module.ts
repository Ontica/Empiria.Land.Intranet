/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { AngularFlexLayoutModule } from '@app/shared/angular-flex-layout.module';

import { SharedModule } from '@app/shared/shared.module';


@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    AngularFlexLayoutModule,
    SharedModule,
  ],
  exports: [

  ],
})
export class ToolsModule { }
