/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { RoutesLibrary } from '@app/models';

import { LandTransactionsWorkspaceComponent } from './land-transactions-workspace.component';

const routes: Routes = [
  {
    data: { permission: RoutesLibrary.transactions_my_inbox.permission },
    path: RoutesLibrary.transactions_my_inbox.path,
    component: LandTransactionsWorkspaceComponent
  },
  {
    data: { permission: RoutesLibrary.transactions_control_desk.permission },
    path: RoutesLibrary.transactions_control_desk.path,
    component: LandTransactionsWorkspaceComponent
  },
  {
    data: { permission: RoutesLibrary.transactions_finished.permission },
    path: RoutesLibrary.transactions_finished.path,
    component: LandTransactionsWorkspaceComponent
  },
  {
    data: { permission: RoutesLibrary.transactions_pending.permission },
    path: RoutesLibrary.transactions_pending.path,
    component: LandTransactionsWorkspaceComponent
  },
  {
    data: { permission: RoutesLibrary.transactions_all.permission },
    path: RoutesLibrary.transactions_all.path,
    component: LandTransactionsWorkspaceComponent
  },
  {
    path: '',
    redirectTo: RoutesLibrary.transactions_my_inbox.path,
    pathMatch: 'full'
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandTransactionsWorkspaceRoutingModule { }
