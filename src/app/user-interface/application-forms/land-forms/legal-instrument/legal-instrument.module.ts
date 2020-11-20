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

import { RecordingActsTableComponent } from './recording-acts-table.component';
import { RecordingActEditorComponent } from './recording-act-editor.component';
import { PartyEditorComponent } from './party-editor.component';
import { PartyListComponent } from './party-list.component';
import { PartySearcherComponent } from './party-searcher.component';
import { NotarialInstrumentHeaderComponent } from './notarial-instrument-header.component';
import { AttachmentsEditorComponent } from './attachments-editor.component';


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
  ],

  declarations: [
    RecordingActsTableComponent,
    RecordingActEditorComponent,
    PartyEditorComponent,
    PartyListComponent,
    PartySearcherComponent,
    NotarialInstrumentHeaderComponent,
    AttachmentsEditorComponent
  ],

  exports: [
    RecordingActsTableComponent,
    RecordingActEditorComponent,
    PartyEditorComponent,
    PartyListComponent,
    PartySearcherComponent,
    NotarialInstrumentHeaderComponent,
    AttachmentsEditorComponent
  ]

})
export class LegalInstrumentModule { }
