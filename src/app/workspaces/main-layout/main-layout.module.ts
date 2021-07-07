/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AngularMaterialModule } from '@app/shared/angular-material.module';
import { AngularFlexLayoutModule } from '@app/shared/angular-flex-layout.module';


import { SharedFormControlsModule } from '@app/shared/form-controls/shared-form-controls.module';
import { SharedIndicatorsModule } from '@app/shared/indicators/shared-indicators.module';

import { MainLayoutComponent } from './main-layout.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { NavigationHeaderComponent } from './nav-header/nav-header.component';
import { NavigationMenuComponent } from './nav-menu/nav-menu.component';
import { NoContentComponent } from './no-content.component';
import { NoPermissionComponent } from './no-permission.component';
import { SharedDirectivesModule } from '@app/shared/directives/shared-directives.module';
import { UserSessionuComponent } from './user-session/user-session.component';


@NgModule({

  imports: [
    CommonModule,
    RouterModule,

    AngularMaterialModule,
    AngularFlexLayoutModule,

    SharedDirectivesModule,
    SharedFormControlsModule,
    SharedIndicatorsModule,
  ],

  declarations: [
    MainLayoutComponent,
    MainMenuComponent,
    NavigationHeaderComponent,
    NavigationMenuComponent,
    NoContentComponent,
    NoPermissionComponent,
    UserSessionuComponent,
  ],

  exports: [
    MainLayoutComponent,
    NoContentComponent,
    NoPermissionComponent,
  ],

  providers: []

})
export class MainLayoutModule { }
