/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { ROUTES } from '@app/main-layout';

import {
  AccessControlMainPageComponent
} from './access-control-main-page/access-control-main-page.component';

import { ControlPanelMainPageComponent } from './control-panel-main-page/control-panel-page.component';


const routes: Routes = [
  {
    data: { permission: ROUTES.administration_control_panel.permission },
    path: ROUTES.administration_control_panel.path,
    component: ControlPanelMainPageComponent,
  },
  {
    data: { permission: ROUTES.administration_access_control.permission },
    path: ROUTES.administration_access_control.path,
    component: AccessControlMainPageComponent,
  },
  {
    path: '',
    redirectTo: ROUTES.administration_control_panel.path,
    pathMatch: 'full',
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemManagementWorkspaceRoutingModule { }
