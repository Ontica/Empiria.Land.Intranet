/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';

import { RecordableSubjectsSearchToolComponent } from './recordable-subjects-search-tool.component';

import { SearchServicesModule } from '../search-services/search-services.module';


@NgModule({
  declarations: [
    RecordableSubjectsSearchToolComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,

    SearchServicesModule,
  ],
  exports: [
    RecordableSubjectsSearchToolComponent,
  ],
})
export class ToolsModule { }
