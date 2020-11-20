/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AngularMaterialModule } from '../angular-material.module';

import { SearchBoxComponent } from './search-box/search-box.component';


@NgModule({

  imports: [
    CommonModule,
    FormsModule,

    AngularMaterialModule
  ],

  declarations: [
    SearchBoxComponent
  ],

  exports: [
    SearchBoxComponent
  ],

})
export class SharedFormControlsModule { }
