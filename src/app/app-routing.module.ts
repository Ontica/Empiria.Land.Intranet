/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SecurityGuardService } from './core';
import { MainLayoutComponent, NoContentComponent } from './user-interface/main-layout';

const routes: Routes = [
  { path: 'transactions',
    component: MainLayoutComponent,
    canActivate: [SecurityGuardService],
    loadChildren: () => import('./user-interface/transactions/transactions.module')
                              .then((m) => m.TransactionsModule)
  },
  { path: 'search-services',
    component: MainLayoutComponent,
    canActivate: [SecurityGuardService],
    loadChildren: () => import('./user-interface/search-services/search-services.module')
                              .then(m => m.SearchServicesModule)
  },
  { path: 'security',
    loadChildren: () => import('./user-interface/security/security-ui.module')
                              .then(m => m.SecurityUIModule)
  },
  { path: '', redirectTo: 'transactions', pathMatch: 'full' },
  { path: '**', component: NoContentComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
