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
import { SharedModule } from '@app/shared/shared.module';

import { LandControlsModule } from '../land-controls/land.controls.module';
import { RegistrationModule } from '../registration/registration.module';

import { RecordSearchComponent } from './record-search/record-search.component';
import { RecordSearchFilterComponent } from './record-search/record-search-filter.component';
import { RecordSearchListComponent } from './record-search/record-search-list.component';
import { RecordSearchListItemComponent } from './record-search/record-search-list-item.component';

import { TractIndexEntriesFilterComponent } from './tract-index-explorer/tract-index-entries-filter.component';
import { TractIndexEntriesHistoryComponent } from './tract-index-explorer/tract-index-entries-history.component';
import { TractIndexEntriesViewerComponent } from './tract-index-explorer/tract-index-entries-viewer.component';
import { TractIndexEntryPrintableViewerComponent } from './tract-index-entry-tabbed-view/tract-index-entry-printable-viewer.component';
import { TractIndexEntryTabbedViewComponent } from './tract-index-entry-tabbed-view/tract-index-entry-tabbed-view.component';
import { TractIndexExplorerComponent } from './tract-index-explorer/tract-index-explorer.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AngularMaterialModule,
    SharedModule,

    LandControlsModule,
    RegistrationModule,
  ],
  declarations: [
    RecordSearchComponent,
    RecordSearchFilterComponent,
    RecordSearchListComponent,
    RecordSearchListItemComponent,
    TractIndexEntriesFilterComponent,
    TractIndexEntriesHistoryComponent,
    TractIndexEntriesViewerComponent,
    TractIndexEntryPrintableViewerComponent,
    TractIndexEntryTabbedViewComponent,
    TractIndexExplorerComponent,
  ],
  exports: [
    RecordSearchComponent,
  ]
})
export class SearchServicesModule { }
