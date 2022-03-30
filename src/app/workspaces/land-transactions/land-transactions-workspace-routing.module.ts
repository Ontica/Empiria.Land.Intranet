/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { ROUTES_LIBRARY } from '@app/main-layout';

import { LandTransactionsWorkspaceComponent } from './land-transactions-workspace.component';

const routes: Routes = [
  {
    data: { permission: ROUTES_LIBRARY.transactions_my_inbox.permission },
    path: ROUTES_LIBRARY.transactions_my_inbox.path,
    component: LandTransactionsWorkspaceComponent
  },
  {
    data: { permission: ROUTES_LIBRARY.transactions_control_desk.permission },
    path: ROUTES_LIBRARY.transactions_control_desk.path,
    component: LandTransactionsWorkspaceComponent
  },
  {
    data: { permission: ROUTES_LIBRARY.transactions_finished.permission },
    path: ROUTES_LIBRARY.transactions_finished.path,
    component: LandTransactionsWorkspaceComponent
  },
  {
    data: { permission: ROUTES_LIBRARY.transactions_pending.permission },
    path: ROUTES_LIBRARY.transactions_pending.path,
    component: LandTransactionsWorkspaceComponent
  },
  {
    data: { permission: ROUTES_LIBRARY.transactions_all.permission },
    path: ROUTES_LIBRARY.transactions_all.path,
    component: LandTransactionsWorkspaceComponent
  },
  {
    path: '',
    redirectTo: ROUTES_LIBRARY.transactions_my_inbox.path,
    pathMatch: 'full'
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandTransactionsWorkspaceRoutingModule { }
