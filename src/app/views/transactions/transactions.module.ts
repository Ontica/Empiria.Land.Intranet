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

import { RequestedServiceEditorComponent } from './transaction-editor/requested-services/requested-service-editor.component';
import { RequestedServiceListComponent } from './transaction-editor/requested-services/requested-service-list.component';
import { TransactionCreatorComponent } from './transaction-creator/transaction-creator.component';
import { TransactionEditorComponent } from './transaction-editor/transaction-editor.component';
import { TransactionFilesComponent } from './transaction-files/transaction-files.component';
import { TransactionHeaderComponent } from './transaction-header/transaction-header.component';
import { TransactionListComponent } from './transaction-list/transaction-list.component';
import { TransactionListEditorComponent } from './transaction-list/transaction-list-editor.component';
import { TransactionListItemComponent } from './transaction-list/transaction-list-item.component';
import { TransactionSubmitterComponent } from './transaction-editor/transaction-submitter/transaction-submitter.component';
import { WorkflowCommandConfigComponent } from './workflow-commander/workflow-command-config.component';
import { WorkflowCommanderComponent } from './workflow-commander/workflow-commander.component';
import { WorkflowHistoryComponent } from './workflow-history/workflow-history.component';


@NgModule({

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AngularMaterialModule,
    AngularFlexLayoutModule,
    SharedModule
  ],

  declarations: [
    RequestedServiceEditorComponent,
    RequestedServiceListComponent,
    TransactionCreatorComponent,
    TransactionEditorComponent,
    TransactionFilesComponent,
    TransactionHeaderComponent,
    TransactionListComponent,
    TransactionListEditorComponent,
    TransactionListItemComponent,
    TransactionSubmitterComponent,
    WorkflowCommandConfigComponent,
    WorkflowCommanderComponent,
    WorkflowHistoryComponent,
  ],

  exports: [
    TransactionCreatorComponent,
    TransactionEditorComponent,
    TransactionEditorComponent,
    TransactionFilesComponent,
    TransactionListComponent,
    WorkflowCommanderComponent,
    WorkflowHistoryComponent,
  ]

})
export class TransactionsModule { }
