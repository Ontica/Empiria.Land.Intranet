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

import { LandControlsModule } from '@app/views/land-controls/land.controls.module';
import { RecordableSubjectsModule } from '@app/views/recordable-subjects/recordable-subjects.module';
import { RegistrationModule } from '@app/views/registration/registration.module';
import { TransactionsModule } from '@app/views/transactions/transactions.module';

import { LandTransactionsWorkspaceRoutingModule } from './land-transactions-workspace-routing.module';
import { LandTransactionsWorkspaceComponent } from './land-transactions-workspace.component';
import { LandPreRegistationComponent } from './parts/land-pre-registration.component';
import { LandRegistrationComponent } from './parts/land-registration.component';
import { LandTransactionTabbedViewComponent } from './parts/land-transaction-tabbed-view.component';
import { InstrumentBookEntriesModule } from '@app/views/registration/instrument-book-entries/instrument-book-entries.module';


@NgModule({

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    AngularFlexLayoutModule,
    SharedModule,

    InstrumentBookEntriesModule,
    LandControlsModule,
    RecordableSubjectsModule,
    RegistrationModule,
    TransactionsModule,

    LandTransactionsWorkspaceRoutingModule,
  ],

  declarations: [
    LandPreRegistationComponent,
    LandRegistrationComponent,
    LandTransactionsWorkspaceComponent,
    LandTransactionTabbedViewComponent
  ],

  exports: [
    LandTransactionsWorkspaceComponent
  ]

})
export class LandTransactionsWorkpaceModule { }
