/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { HistoricRegistrationWorkspaceComponent } from './historic-registration-workspace.component';

import { HistoricRegistrationWorkspaceRoutingModule } from './historic-registration-workspace-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { RegistrationModule } from '@app/views/registration/registration.module';
import { RecordableSubjectsModule } from '@app/views/recordable-subjects/recordable-subjects.module';
import { AngularFlexLayoutModule } from '@app/shared/angular-flex-layout.module';
import { LandControlsModule } from '@app/views/land-controls/land.controls.module';


@NgModule({

  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularFlexLayoutModule,

    HistoricRegistrationWorkspaceRoutingModule,
    SharedModule,
    LandControlsModule,
    RegistrationModule,
    RecordableSubjectsModule,
  ],

  declarations: [
    HistoricRegistrationWorkspaceComponent
  ],

  exports: [
    HistoricRegistrationWorkspaceComponent
  ]

})
export class HistoricRegistrationWorkspaceModule { }
