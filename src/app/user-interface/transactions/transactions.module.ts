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

import { TransactionsMainPageComponent } from './main-page/transactions-main-page.component';
import { RequestCreatorComponent } from './request-creator/request-creator.component';
import { RequesterDataComponent } from './requester-data/requester-data.component';
import { RequestListComponent } from './request-list/request-list.component';
import { RequestListItemComponent } from './request-list/request-list-item.component';

import { DocumentRecordingModule } from '../document-recording/document-recording.module';
import { TransactionsRoutingModule } from './transactions-routing.module';
import { RequestTabbedViewComponent } from './request-tabbed-view/request-tabbed-view.component';


@NgModule({

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    AngularFlexLayoutModule,
    SharedModule,
    
    DocumentRecordingModule,
    TransactionsRoutingModule,
  ],

  declarations: [
    TransactionsMainPageComponent,
    RequestCreatorComponent,
    RequesterDataComponent,
    RequestListComponent,
    RequestListItemComponent,
    RequestTabbedViewComponent,
  ],

  exports: []

})
export class TransactionsModule { }
