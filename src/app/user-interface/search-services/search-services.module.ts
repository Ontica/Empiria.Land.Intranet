/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { SearchServicesRoutingModule } from './search-services-routing.module';
import { SearchServicesMainPageComponent } from './main-page/search-services-main-page.component';


@NgModule({

  imports: [
    CommonModule,
    ReactiveFormsModule,

    SearchServicesRoutingModule
  ],

  declarations: [
    SearchServicesMainPageComponent
  ],

  exports: []

})
export class SearchServicesModule { }
