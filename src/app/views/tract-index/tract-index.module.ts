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
import { TractIndexEntriesFilterComponent } from './tract-index-explorer/tract-index-entries-filter.component';
import { TractIndexEntriesTableComponent } from './tract-index-explorer/tract-index-entries-table.component';
import { TractIndexEntriesViewerComponent } from './tract-index-explorer/tract-index-entries-viewer.component';
import { TractIndexExplorerComponent } from './tract-index-explorer/tract-index-explorer.component';
import { TractIndexEntryPrintableViewerComponent } from './tract-index-entry-tabbed-view/tract-index-entry-printable-viewer.component';
import { TractIndexEntryTabbedViewComponent } from './tract-index-entry-tabbed-view/tract-index-entry-tabbed-view.component';
import { LandControlsModule } from '../land-controls/land.controls.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AngularMaterialModule,
    AngularFlexLayoutModule,
    SharedModule,

    LandControlsModule,
    RegistrationModule,
  ],
  declarations: [
    RecordableSubjectsExplorerComponent,
    RecordableSubjectsFilterComponent,
    RecordableSubjectsTableComponent,
    RecordableSubjectsViewerComponent,
    TractIndexEntriesFilterComponent,
    TractIndexEntriesTableComponent,
    TractIndexEntriesViewerComponent,
    TractIndexExplorerComponent,
    TractIndexEntryPrintableViewerComponent,
    TractIndexEntryTabbedViewComponent,
  ],
  exports: [
    RecordableSubjectsExplorerComponent,
  ]
})
export class TractIndexModule { }
