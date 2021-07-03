/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';

import { SecurityGuard } from './core';

import { RoutesLibrary } from './models';

import { MainLayoutComponent, NoContentComponent, NoPermissionComponent } from './workspaces/main-layout';


const routes: Routes = [
  {
    data: { permission: RoutesLibrary.transactions.permission },
    path: RoutesLibrary.transactions.path,
    component: MainLayoutComponent,
    canActivate: [SecurityGuard],
    canActivateChild: [SecurityGuard],
    loadChildren: () => import('./workspaces/land-transactions/land-transactions-workspace.module')
                              .then((m) => m.LandTransactionsWorkpaceModule)
  },
  {
    data: { permission: RoutesLibrary.search_services.permission },
    path: RoutesLibrary.search_services.path,
    component: MainLayoutComponent,
    canActivate: [SecurityGuard],
    canActivateChild: [SecurityGuard],
    loadChildren: () => import('./workspaces/land-search/land-search-workspace.module')
                              .then(m => m.LandSearchWorkspaceModule)
  },
  {
    data: { permission: RoutesLibrary.historic_registration.permission },
    path: RoutesLibrary.historic_registration.path,
    component: MainLayoutComponent,
    canActivate: [SecurityGuard],
    canActivateChild: [SecurityGuard],
    loadChildren: () => import('./workspaces/historic-registration/historic-registration-workspace.module')
                              .then(m => m.HistoricRegistrationWorkspaceModule)
  },
  {
    path: RoutesLibrary.security.path,
    loadChildren: () => import('./views/security/security-ui.module')
                              .then(m => m.SecurityUIModule)
  },
  { path: 'unauthorized', component: NoPermissionComponent },
  { path: '', redirectTo: RoutesLibrary.transactions.path, pathMatch: 'full' },
  { path: '**', component: NoContentComponent },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
