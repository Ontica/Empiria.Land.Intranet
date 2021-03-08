/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LandTransactionsWorkspaceComponent } from './land-transactions-workspace.component';


const routes: Routes = [
  { path: 'my-inbox', component: LandTransactionsWorkspaceComponent },
  { path: 'control-desk', component: LandTransactionsWorkspaceComponent },
  { path: 'finished', component: LandTransactionsWorkspaceComponent },
  { path: 'pending', component: LandTransactionsWorkspaceComponent },
  { path: 'all', component: LandTransactionsWorkspaceComponent },
  { path: '', redirectTo: 'my-inbox', pathMatch: 'full' }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandTransactionsWorkspaceRoutingModule { }
