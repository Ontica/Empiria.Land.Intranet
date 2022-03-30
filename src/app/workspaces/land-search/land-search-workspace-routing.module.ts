/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { ROUTES_LIBRARY } from '@app/main-layout';

import { LandSearchWorkspaceComponent } from './land-search-workspace.component';

const routes: Routes = [
  {
    data: { permission: ROUTES_LIBRARY.search_services_all.permission },
    path: ROUTES_LIBRARY.search_services_all.path,
    component: LandSearchWorkspaceComponent
  },
  {
    data: { permission: ROUTES_LIBRARY.search_services_real_estate.permission },
    path: ROUTES_LIBRARY.search_services_real_estate.path,
    component: LandSearchWorkspaceComponent
  },
  {
    data: { permission: ROUTES_LIBRARY.search_services_associations.permission },
    path: ROUTES_LIBRARY.search_services_associations.path,
    component: LandSearchWorkspaceComponent
  },
  {
    data: { permission: ROUTES_LIBRARY.search_services_persons.permission },
    path: ROUTES_LIBRARY.search_services_persons.path,
    component: LandSearchWorkspaceComponent
  },
  {
    data: { permission: ROUTES_LIBRARY.search_services_documents.permission },
    path: ROUTES_LIBRARY.search_services_documents.path,
    component: LandSearchWorkspaceComponent
  },
  {
    data: { permission: ROUTES_LIBRARY.search_services_certificates.permission },
    path: ROUTES_LIBRARY.search_services_certificates.path,
    component: LandSearchWorkspaceComponent
  },
  {
    data: { permission: ROUTES_LIBRARY.search_services_transactions.permission },
    path: ROUTES_LIBRARY.search_services_transactions.path,
    component: LandSearchWorkspaceComponent
  },
  {
    data: { permission: ROUTES_LIBRARY.search_services_books.permission },
    path: ROUTES_LIBRARY.search_services_books.path,
    component: LandSearchWorkspaceComponent
  },
  {
    path: '',
    redirectTo: ROUTES_LIBRARY.search_services_all.path,
    pathMatch: 'full'
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandSearchWorkspaceRoutingModule { }
