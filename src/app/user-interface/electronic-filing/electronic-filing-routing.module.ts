/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ElectronicFilingMainPageComponent } from './main-page/electronic-filing-main-page.component';


const routes: Routes = [
  { path: 'pending', component: ElectronicFilingMainPageComponent },
  { path: 'on-sign', component: ElectronicFilingMainPageComponent },
  { path: 'on-payment', component: ElectronicFilingMainPageComponent },
  { path: 'submitted', component: ElectronicFilingMainPageComponent },
  { path: 'finished', component: ElectronicFilingMainPageComponent },
  { path: 'rejected', component: ElectronicFilingMainPageComponent },
  { path: 'all', component: ElectronicFilingMainPageComponent },
  { path: '', redirectTo: 'pending', pathMatch: 'full' }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ElectronicFilingRoutingModule { }
