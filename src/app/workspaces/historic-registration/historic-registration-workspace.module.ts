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
import { AngularFlexLayoutModule } from '@app/shared/angular-flex-layout.module';

import { LandControlsModule } from '@app/views/land-controls/land.controls.module';
import { RegistrationModule } from '@app/views/registration/registration.module';

import { HistoricRegistrationWorkspaceRoutingModule } from './historic-registration-workspace-routing.module';
import { BookEntryWorkspaceComponent } from './book-entry-workspace.component';
import { HistoricRegistrationWorkspaceComponent } from './historic-registration-workspace.component';


@NgModule({

  imports: [
    CommonModule,
    ReactiveFormsModule,

    AngularFlexLayoutModule,
    SharedModule,

    LandControlsModule,
    RegistrationModule,

    HistoricRegistrationWorkspaceRoutingModule,
  ],

  declarations: [
    BookEntryWorkspaceComponent,
    HistoricRegistrationWorkspaceComponent,
  ],

  exports: [
    BookEntryWorkspaceComponent,
    HistoricRegistrationWorkspaceComponent,
  ]

})
export class HistoricRegistrationWorkspaceModule { }
