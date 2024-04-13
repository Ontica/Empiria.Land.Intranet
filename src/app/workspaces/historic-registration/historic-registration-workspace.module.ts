/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@app/shared/shared.module';

import { LandControlsModule } from '@app/views/land-controls/land.controls.module';
import { RegistrationModule } from '@app/views/registration/registration.module';

import { HistoricRegistrationWorkspaceRoutingModule } from './historic-registration-workspace-routing.module';
import { BookEntryMainPageComponent } from './book-entry-main-page/book-entry-main-page.component';
import { HistoricRegistrationMainPageComponent } from './historic-registration-main-page/historic-registration-main-page.component';


@NgModule({

  imports: [
    CommonModule,
    ReactiveFormsModule,

    SharedModule,

    LandControlsModule,
    RegistrationModule,

    HistoricRegistrationWorkspaceRoutingModule,
  ],

  declarations: [
    BookEntryMainPageComponent,
    HistoricRegistrationMainPageComponent,
  ],

  exports: [
    BookEntryMainPageComponent,
    HistoricRegistrationMainPageComponent,
  ]

})
export class HistoricRegistrationWorkspaceModule { }
