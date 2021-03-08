/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { LandSearchWorkspaceComponent } from './land-search-workspace.component';

import { LandSearchWorkspaceRoutingModule } from './land-search-workspace-routing.module';


@NgModule({

  imports: [
    CommonModule,
    ReactiveFormsModule,

    LandSearchWorkspaceRoutingModule
  ],

  declarations: [
    LandSearchWorkspaceComponent
  ],

  exports: [
    LandSearchWorkspaceComponent
  ]

})
export class LandSearchWorkspaceModule { }
