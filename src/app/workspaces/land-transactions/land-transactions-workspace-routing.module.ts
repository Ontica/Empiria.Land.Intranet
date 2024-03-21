/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { ROUTES } from '@app/main-layout';

import { TransactionsMainPageComponent } from './transactions-main-page/transactions-main-page.component';

const routes: Routes = [
  {
    data: { permission: ROUTES.transactions_my_inbox.permission },
    path: ROUTES.transactions_my_inbox.path,
    component: TransactionsMainPageComponent
  },
  {
    data: { permission: ROUTES.transactions_e_sign.permission },
    path: ROUTES.transactions_e_sign.path,
    component: TransactionsMainPageComponent
  },
  {
    data: { permission: ROUTES.transactions_control_desk.permission },
    path: ROUTES.transactions_control_desk.path,
    component: TransactionsMainPageComponent
  },
  {
    data: { permission: ROUTES.transactions_finished.permission },
    path: ROUTES.transactions_finished.path,
    component: TransactionsMainPageComponent
  },
  {
    data: { permission: ROUTES.transactions_pending.permission },
    path: ROUTES.transactions_pending.path,
    component: TransactionsMainPageComponent
  },
  {
    data: { permission: ROUTES.transactions_all.permission },
    path: ROUTES.transactions_all.path,
    component: TransactionsMainPageComponent
  },
  {
    path: '',
    redirectTo: ROUTES.transactions_my_inbox.path,
    pathMatch: 'full'
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandTransactionsWorkspaceRoutingModule { }
