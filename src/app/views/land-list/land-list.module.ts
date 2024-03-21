/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularMaterialModule } from '@app/shared/angular-material.module';
import { AngularFlexLayoutModule } from '@app/shared/angular-flex-layout.module';
import { SharedModule } from '@app/shared/shared.module';

import { LandExplorerComponent } from './land-explorer/land-explorer.component';
import { ListActionsComponent } from './land-explorer/land-list-actions.component';
import { ListControlsComponent } from './land-explorer/land-list-controls.component';
import { ListComponent } from './land-explorer/land-list.component';

import { ListSelectorComponent } from './land-list-selector/land-list-selector.component';

import { TransactionListItemComponent } from './land-list-items/transaction-list-item.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AngularMaterialModule,
    AngularFlexLayoutModule,
    SharedModule,
  ],
  declarations: [
    LandExplorerComponent,
    ListActionsComponent,
    ListControlsComponent,
    ListComponent,
    ListSelectorComponent,

    TransactionListItemComponent,
  ],
  exports: [
    LandExplorerComponent,
    ListSelectorComponent,
  ]
})
export class LandListModule { }
