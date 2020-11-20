/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { LandFormsModule } from './land-forms.module';


@NgModule({

  imports: [
    LandFormsModule
  ],

  exports: [
    LandFormsModule
  ]

})
export class ApplicationFormsModule { }
