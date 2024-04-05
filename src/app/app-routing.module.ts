/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';

import { ChildRouteGuard, ParentRouteGuard } from './core';

import { DEFAULT_PATH, MainLayoutComponent, NoContentComponent, ROUTES } from '@app/main-layout';


const routes: Routes = [
  {
    data: { permission: ROUTES.transactions.permission },
    path: ROUTES.transactions.path,
    component: MainLayoutComponent,
    canActivate: [ParentRouteGuard],
    canActivateChild: [ChildRouteGuard],
    loadChildren: () => import('./workspaces/land-transactions/land-transactions-workspace.module')
                              .then((m) => m.LandTransactionsWorkpaceModule)
  },
  {
    data: { permission: ROUTES.historic_registration.permission },
    path: ROUTES.historic_registration.path,
    component: MainLayoutComponent,
    canActivate: [ParentRouteGuard],
    canActivateChild: [ChildRouteGuard],
    loadChildren: () => import('./workspaces/historic-registration/historic-registration-workspace.module')
                              .then(m => m.HistoricRegistrationWorkspaceModule)
  },
  {
    data: { permission: ROUTES.administration.permission },
    path: ROUTES.administration.path,
    component: MainLayoutComponent,
    canActivate: [ParentRouteGuard],
    canActivateChild: [ChildRouteGuard],
    loadChildren: () => import('./workspaces/system-management/system-management-workspace.module')
      .then((m) => m.SystemManagementWorkspaceModule)
  },
  {
    path: ROUTES.unauthorized.path,
    canActivate: [ParentRouteGuard],
    component: MainLayoutComponent,
    loadChildren: () => import('./views/_unauthorized/unauthorized.module')
                              .then(m => m.UnauthorizedModule)
  },
  {
    path: ROUTES.security.path,
    loadChildren: () => import('./views/_security/security-ui.module')
                              .then(m => m.SecurityUIModule)
  },
  { path: '', redirectTo: DEFAULT_PATH, pathMatch: 'full' },
  { path: '**', component: NoContentComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
