/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { ROUTES } from '@app/main-layout';

import { BookEntryMainPageComponent } from './book-entry-main-page/book-entry-main-page.component';

import {
  HistoricRegistrationMainPageComponent
} from './historic-registration-main-page/historic-registration-main-page.component';


const routes: Routes = [
  {
    data: { permission: ROUTES.historic_registration_by_book.permission },
    path: ROUTES.historic_registration_by_book.path,
    component: HistoricRegistrationMainPageComponent
  },
  {
    data: { permission: ROUTES.historic_registration_book_entry.permission },
    path: ROUTES.historic_registration_book_entry.path,
    component: BookEntryMainPageComponent
  },
  {
    path: '',
    redirectTo: ROUTES.historic_registration_by_book.path,
    pathMatch: 'full'
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HistoricRegistrationWorkspaceRoutingModule { }
