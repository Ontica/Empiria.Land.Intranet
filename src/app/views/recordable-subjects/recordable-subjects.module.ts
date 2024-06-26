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

import { InstrumentEditorComponent } from './instrument/instrument-editor.component';

import { NoPropertyEditorComponent } from './no-property/no-property-editor.component';
import { RealEstateEditorComponent } from './real-estate/real-estate-editor.component';

import { PartyEditorComponent } from './parties/party-editor.component';
import { PartyListComponent } from './parties/party-list.component';
import { PartySelectorComponent } from './parties/party-selector.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AngularMaterialModule,
    SharedModule
  ],

  declarations: [
    InstrumentEditorComponent,
    PartyEditorComponent,
    PartyListComponent,
    PartySelectorComponent,
    NoPropertyEditorComponent,
    RealEstateEditorComponent,
  ],

  exports: [
    InstrumentEditorComponent,
    PartyEditorComponent,
    PartyListComponent,
    PartySelectorComponent,
    NoPropertyEditorComponent,
    RealEstateEditorComponent,
  ]
})
export class RecordableSubjectsModule { }
