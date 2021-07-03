/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { RoutesLibrary } from '@app/models';

import { HistoricRegistrationWorkspaceComponent } from './historic-registration-workspace.component';


const routes: Routes = [
  {
    data: { permission: RoutesLibrary.historic_registration_by_book.permission },
    path: RoutesLibrary.historic_registration_by_book.path,
    component: HistoricRegistrationWorkspaceComponent
  },
  { path: '', redirectTo: RoutesLibrary.historic_registration_by_book.path, pathMatch: 'full' }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HistoricRegistrationWorkspaceRoutingModule { }
