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

import { InstrumentEditorComponent } from './instrument/instrument-editor.component';

import { PartyEditorComponent } from './parties/party-editor.component';
import { PartyListComponent } from './parties/party-list.component';

import { RealEstateEditorComponent } from './real-estate/real-estate-editor.component';


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
    InstrumentEditorComponent,
    PartyEditorComponent,
    PartyListComponent,
    RealEstateEditorComponent,
  ],

  exports: [
    InstrumentEditorComponent,
    PartyEditorComponent,
    PartyListComponent,
    RealEstateEditorComponent,
  ]
})
export class RecordableSubjectsModule { }
