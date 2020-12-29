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

import { InstrumentEditionModule } from '../instrument-edition/instrument-edition.module';
import { InstrumentRecordingModule } from '../instrument-recording/instrument-recording.module';

import { RequestListComponent } from './transaction-list/transaction-list.component';
import { RequestListItemComponent } from './transaction-list/transaction-list-item.component';
import { RequestTabbedViewComponent } from './transaction-tabbed-view/transaction-tabbed-view.component';
import { TransactionsRoutingModule } from './transactions-routing.module';
import { TransactionsMainPageComponent } from './main-page/transactions-main-page.component';


@NgModule({

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    AngularFlexLayoutModule,
    SharedModule,
    TransactionsRoutingModule,
    InstrumentEditionModule,
    InstrumentRecordingModule,
  ],

  declarations: [
    TransactionsMainPageComponent,
    RequestListComponent,
    RequestListItemComponent,
    RequestTabbedViewComponent,
  ],

  exports: []

})
export class TransactionsModule { }
