/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SearchServicesMainPageComponent } from './main-page/search-services-main-page.component';


const routes: Routes = [
  { path: 'all', component: SearchServicesMainPageComponent },
  { path: 'real-estate', component: SearchServicesMainPageComponent },
  { path: 'associations', component: SearchServicesMainPageComponent },
  { path: 'persons', component: SearchServicesMainPageComponent },
  { path: 'documents', component: SearchServicesMainPageComponent },
  { path: 'certificates', component: SearchServicesMainPageComponent },
  { path: 'transactions', component: SearchServicesMainPageComponent },
  { path: 'books', component: SearchServicesMainPageComponent },
  { path: '', redirectTo: 'all', pathMatch: 'full' }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchServicesRoutingModule { }
