/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';

import { SecurityGuard } from '@app/core';

import { DEFAULT_URL, MainLayoutComponent, NoContentComponent, ROUTES_LIBRARY } from '@app/main-layout';


const routes: Routes = [
  {
    data: { permission: ROUTES_LIBRARY.transactions.permission },
    path: ROUTES_LIBRARY.transactions.path,
    component: MainLayoutComponent,
    canActivate: [SecurityGuard],
    canActivateChild: [SecurityGuard],
    loadChildren: () => import('./workspaces/land-transactions/land-transactions-workspace.module')
                              .then((m) => m.LandTransactionsWorkpaceModule)
  },
  {
    data: { permission: ROUTES_LIBRARY.historic_registration.permission },
    path: ROUTES_LIBRARY.historic_registration.path,
    component: MainLayoutComponent,
    canActivate: [SecurityGuard],
    canActivateChild: [SecurityGuard],
    loadChildren: () => import('./workspaces/historic-registration/historic-registration-workspace.module')
                              .then(m => m.HistoricRegistrationWorkspaceModule)
  },
  {
    path: ROUTES_LIBRARY.unauthorized.path,
    canActivate: [SecurityGuard],
    component: MainLayoutComponent,
    loadChildren: () => import('./views/_unauthorized/unauthorized.module')
                              .then(m => m.UnauthorizedModule)
  },
  {
    path: ROUTES_LIBRARY.security.path,
    loadChildren: () => import('./views/_security/security-ui.module')
                              .then(m => m.SecurityUIModule)
  },
  { path: '', redirectTo: DEFAULT_URL, pathMatch: 'full' },
  { path: '**', component: NoContentComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
