/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { ROUTES_LIBRARY } from '@app/main-layout';

import { BookEntryWorkspaceComponent } from './book-entry-workspace.component';

import { HistoricRegistrationWorkspaceComponent } from './historic-registration-workspace.component';


const routes: Routes = [
  {
    data: { permission: ROUTES_LIBRARY.historic_registration_by_book.permission },
    path: ROUTES_LIBRARY.historic_registration_by_book.path,
    component: HistoricRegistrationWorkspaceComponent
  },
  {
    data: { permission: ROUTES_LIBRARY.historic_registration_book_entry.permission },
    path: ROUTES_LIBRARY.historic_registration_book_entry.path,
    component: BookEntryWorkspaceComponent
  },
  {
    path: '',
    redirectTo: ROUTES_LIBRARY.historic_registration_by_book.path,
    pathMatch: 'full'
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HistoricRegistrationWorkspaceRoutingModule { }
