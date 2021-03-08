/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LandSearchWorkspaceComponent } from './land-search-workspace.component';


const routes: Routes = [
  { path: 'all', component: LandSearchWorkspaceComponent },
  { path: 'real-estate', component: LandSearchWorkspaceComponent },
  { path: 'associations', component: LandSearchWorkspaceComponent },
  { path: 'persons', component: LandSearchWorkspaceComponent },
  { path: 'documents', component: LandSearchWorkspaceComponent },
  { path: 'certificates', component: LandSearchWorkspaceComponent },
  { path: 'transactions', component: LandSearchWorkspaceComponent },
  { path: 'books', component: LandSearchWorkspaceComponent },
  { path: '', redirectTo: 'all', pathMatch: 'full' }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandSearchWorkspaceRoutingModule { }
