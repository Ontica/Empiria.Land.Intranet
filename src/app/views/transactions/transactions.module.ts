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

import { LandListModule } from '../land-list/land-list.module';

import { TransactionHeaderComponent } from './transaction-header/transaction-header.component';
import { TransactionCreatorComponent } from './transaction-creator/transaction-creator.component';
import { TransactionEditorComponent } from './transaction-editor/transaction-editor.component';
import { TransactionSubmitterComponent } from './transaction-editor/transaction-submitter/transaction-submitter.component';
import { TransactionFilesComponent } from './transaction-files/transaction-files.component';
import { WorkflowCommandConfigComponent } from './workflow-commander/workflow-command-config.component';
import { WorkflowCommanderComponent } from './workflow-commander/workflow-commander.component';
import { WorkflowHistoryComponent } from './workflow-history/workflow-history.component';
import { RequestedServiceEditorComponent } from './transaction-editor/requested-services/requested-service-editor.component';
import { RequestedServiceListComponent } from './transaction-editor/requested-services/requested-service-list.component';


@NgModule({

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AngularMaterialModule,
    AngularFlexLayoutModule,
    SharedModule,

    LandListModule,
  ],

  declarations: [
    TransactionHeaderComponent,
    TransactionCreatorComponent,
    TransactionEditorComponent,
    TransactionSubmitterComponent,
    TransactionFilesComponent,
    WorkflowCommandConfigComponent,
    WorkflowCommanderComponent,
    WorkflowHistoryComponent,
    RequestedServiceEditorComponent,
    RequestedServiceListComponent,
  ],

  exports: [
    TransactionCreatorComponent,
    TransactionEditorComponent,
    TransactionFilesComponent,
    WorkflowCommanderComponent,
    WorkflowHistoryComponent,
  ]

})
export class TransactionsModule { }
