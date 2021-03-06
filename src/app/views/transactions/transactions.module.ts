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
import { LandControlsModule } from '../land-controls/land.controls.module';

import { InstrumentEditionModule } from '../instrument-edition/instrument-edition.module';
import { InstrumentRecordingModule } from '../instrument-recording/instrument-recording.module';
import { RegistrationModule } from '../registration/registration.module';

import { TransactionsRoutingModule } from './transactions-routing.module';

import { TransactionListComponent } from './transaction-list/transaction-list.component';
import { TransactionListEditorComponent } from './transaction-list/transaction-list-editor.component';
import { TransactionListItemComponent } from './transaction-list/transaction-list-item.component';
import { TransactionTabbedViewComponent } from './transaction-tabbed-view/transaction-tabbed-view.component';
import { TransactionsMainPageComponent } from './main-page/transactions-main-page.component';
import { TransactionHeaderComponent } from './transaction-header/transaction-header.component';
import { TransactionCreatorComponent } from './transaction-creator/transaction-creator.component';
import { TransactionEditorComponent } from './transaction-editor/transaction-editor.component';

import {
  RequestedServiceListComponent
} from './transaction-editor/requested-services/requested-service-list.component';

import {
  RequestedServiceEditorComponent
} from './transaction-editor/requested-services/requested-service-editor.component';

import {
  TransactionSubmitterComponent
} from './transaction-editor/transaction-submitter/transaction-submitter.component';

import { PreprocessingComponent } from './preprocessing/preprocessing.component';

import {
  InstrumentFilesEditorComponent
} from './preprocessing/instrument-files-editor/instrument-files-editor.component';

import { WorkflowHistoryComponent } from './workflow-history/workflow-history.component';
import { WorkflowCommanderComponent } from './workflow-commander/workflow-commander.component';
import { WorkflowCommandConfigComponent } from './workflow-commander/workflow-command-config.component';


@NgModule({

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    AngularFlexLayoutModule,
    SharedModule,
    LandControlsModule,
    TransactionsRoutingModule,
    InstrumentEditionModule,
    InstrumentRecordingModule,
    RegistrationModule,
  ],

  declarations: [
    InstrumentFilesEditorComponent,
    PreprocessingComponent,
    RequestedServiceEditorComponent,
    RequestedServiceListComponent,
    TransactionCreatorComponent,
    TransactionEditorComponent,
    TransactionHeaderComponent,
    TransactionListComponent,
    TransactionListEditorComponent,
    TransactionListItemComponent,
    TransactionsMainPageComponent,
    TransactionSubmitterComponent,
    TransactionTabbedViewComponent,
    WorkflowCommandConfigComponent,
    WorkflowCommanderComponent,
    WorkflowHistoryComponent
  ],

  exports: []

})
export class TransactionsModule { }
