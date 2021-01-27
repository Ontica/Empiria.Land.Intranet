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

import { TransactionListComponent } from './transaction-list/transaction-list.component';
import { TransactionListItemComponent } from './transaction-list/transaction-list-item.component';
import { TransactionTabbedViewComponent } from './transaction-tabbed-view/transaction-tabbed-view.component';
import { TransactionsMainPageComponent } from './main-page/transactions-main-page.component';
import { TransactionsRoutingModule } from './transactions-routing.module';
import { TransactionHeaderComponent } from './transaction-header/transaction-header.component';
import { TransactionCreatorComponent } from './transaction-creator/transaction-creator.component';
import { TransactionEditorComponent } from './transaction-editor/transaction-editor.component';
import { RequestedServiceListComponent }
  from './transaction-editor/requested-services/requested-service-list.component';
import { RequestedServiceEditorComponent }
  from './transaction-editor/requested-services/requested-service-editor.component';
import { TransactionSubmitterComponent }
  from './transaction-editor/transaction-submitter/transaction-submitter.component';


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
    TransactionListComponent,
    TransactionListItemComponent,
    TransactionTabbedViewComponent,
    TransactionHeaderComponent,
    TransactionCreatorComponent,
    TransactionEditorComponent,
    RequestedServiceListComponent,
    RequestedServiceEditorComponent,
    TransactionSubmitterComponent,
  ],

  exports: []

})
export class TransactionsModule { }
