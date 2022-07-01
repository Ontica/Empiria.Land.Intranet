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

import { RegistrationModule } from '../registration/registration.module';

import { RecordableSubjectsExplorerComponent } from './recordable-subjects-explorer/recordable-subjects-explorer.component';
import { RecordableSubjectsFilterComponent } from './recordable-subjects-explorer/recordable-subjects-filter.component';
import { RecordableSubjectsTableComponent } from './recordable-subjects-explorer/recordable-subjects-table.component';
import { RecordableSubjectsViewerComponent } from './recordable-subjects-explorer/recordable-subjects-viewer.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    AngularFlexLayoutModule,
    SharedModule,

    RegistrationModule,
  ],
  declarations: [
    RecordableSubjectsExplorerComponent,
    RecordableSubjectsFilterComponent,
    RecordableSubjectsTableComponent,
    RecordableSubjectsViewerComponent,
  ],
  exports: [
    RecordableSubjectsExplorerComponent,
  ]
})
export class TractIndexModule { }
