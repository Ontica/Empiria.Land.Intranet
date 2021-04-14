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

import { HsitoricRegistrationWorkspaceRoutingModule } from './historic-registration-workspace-routing.module';


@NgModule({

  imports: [
    CommonModule,
    ReactiveFormsModule,

    HsitoricRegistrationWorkspaceRoutingModule
  ],

  declarations: [
    HistoricRegistrationWorkspaceComponent
  ],

  exports: [
    HistoricRegistrationWorkspaceComponent
  ]

})
export class HistoricRegistrationWorkspaceModule { }
