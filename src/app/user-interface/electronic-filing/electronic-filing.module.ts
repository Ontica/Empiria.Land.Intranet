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

import { SharedContainersModule } from '@app/shared/containers/shared-containers.module';
import { SharedFormControlsModule } from '@app/shared/form-controls/shared-form-controls.module';
import { SharedIndicatorsModule } from '@app/shared/indicators/shared-indicators.module';

import { ElectronicFilingMainPageComponent } from './main-page/electronic-filing-main-page.component';
import { RequestCreatorComponent } from './request-creator/request-creator.component';
import { RequesterDataComponent } from './requester-data/requester-data.component';
import { RequestListComponent } from './request-list/request-list.component';
import { RequestListItemComponent } from './request-list/request-list-item.component';
import { RequestSubmitterComponent } from './request-submitter/request-submitter.component';
import { RequestTabbedViewComponent } from './request-tabbed-view/request-tabbed-view.component';
import { RequestFilesListComponent } from './request-files-list/request-files-list.component';

import { ApplicationFormsModule } from '../application-forms/application-forms.module';
import { DocumentRecordingModule } from '../document-recording/document-recording.module';

import { ElectronicFilingRoutingModule } from './electronic-filing-routing.module';


@NgModule({

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    AngularFlexLayoutModule,

    SharedContainersModule,
    SharedFormControlsModule,
    SharedIndicatorsModule,

    ApplicationFormsModule,
    DocumentRecordingModule,

    ElectronicFilingRoutingModule
  ],

  declarations: [
    ElectronicFilingMainPageComponent,
    RequestCreatorComponent,
    RequesterDataComponent,
    RequestListComponent,
    RequestListItemComponent,
    RequestSubmitterComponent,
    RequestTabbedViewComponent,
    RequestFilesListComponent
  ],

  exports: []

})
export class ElectronicFilingModule { }
