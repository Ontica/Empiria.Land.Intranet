/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TransactionsMainPageComponent } from './main-page/transactions-main-page.component';


const routes: Routes = [
  { path: 'pending', component: TransactionsMainPageComponent },
  { path: 'on-sign', component: TransactionsMainPageComponent },
  { path: 'on-payment', component: TransactionsMainPageComponent },
  { path: 'submitted', component: TransactionsMainPageComponent },
  { path: 'finished', component: TransactionsMainPageComponent },
  { path: 'rejected', component: TransactionsMainPageComponent },
  { path: 'all', component: TransactionsMainPageComponent },
  { path: '', redirectTo: 'pending', pathMatch: 'full' }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionsRoutingModule { }
