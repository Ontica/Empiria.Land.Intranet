/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HistoricRegistrationWorkspaceComponent } from './historic-registration-workspace.component';


const routes: Routes = [
  { path: 'by-book', component: HistoricRegistrationWorkspaceComponent },
  { path: '', redirectTo: 'by-book', pathMatch: 'full' }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HistoricRegistrationWorkspaceRoutingModule { }
