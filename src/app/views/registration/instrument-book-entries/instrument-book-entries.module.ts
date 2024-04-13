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

import { InstrumentBookEntryCreatorComponent } from './instrument-book-entry-creator.component';
import { InstrumentBookEntryListComponent } from './instrument-book-entry-list.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    SharedModule
  ],

  declarations: [
    InstrumentBookEntryCreatorComponent,
    InstrumentBookEntryListComponent,
  ],

  exports: [
    InstrumentBookEntryCreatorComponent,
    InstrumentBookEntryListComponent,
  ]
})
export class InstrumentBookEntriesModule { }
