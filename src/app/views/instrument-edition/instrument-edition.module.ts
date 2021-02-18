/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgSelectModule } from '@ng-select/ng-select';

import { AngularMaterialModule } from '@app/shared/angular-material.module';
import { AngularFlexLayoutModule } from '@app/shared/angular-flex-layout.module';
import { SharedModule } from '@app/shared/shared.module';

import { InstrumentEditionComponent } from './instrument-edition.component';
import { RecordingActsEditorComponent } from './recording-acts/recording-acts-editor.component';
import { InstrumentHeaderComponent } from './instrument/instrument-header.component';
import { PartyListComponent } from './parties/party-list.component';
import { PartyEditorComponent } from './parties/party-editor.component';
import { PhysicalRecordingEditorComponent } from './physical-recording/physical-recording-editor.component';
import { PhysicalRecordingListComponent } from './physical-recording/physical-recording-list.component';


@NgModule({
  declarations: [
    InstrumentEditionComponent,
    InstrumentHeaderComponent,
    PartyListComponent,
    PartyEditorComponent,
    RecordingActsEditorComponent,
    PhysicalRecordingListComponent,
    PhysicalRecordingEditorComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    AngularMaterialModule,
    AngularFlexLayoutModule,
    SharedModule
  ],
  exports: [
    InstrumentEditionComponent,
    RecordingActsEditorComponent,
  ]
})
export class InstrumentEditionModule { }
