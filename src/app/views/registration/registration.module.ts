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
import { LandControlsModule } from '../land-controls/land.controls.module';
import { RecordingActsListComponent }
  from './recording-acts/recording-acts-list/recording-acts-list.component';
import { RecordingActCreatorComponent }
  from './recording-acts/recording-act-creator/recording-act-creator.component';
import { RecordingActEditorComponent }
  from './recording-acts/recording-act-editor/recording-act-editor.component';
import { RealEstateEditorComponent }
  from './recording-acts/recording-act-editor/real-estate-editor.component';


@NgModule({
  declarations: [
    RecordingActsListComponent,
    RecordingActCreatorComponent,
    RecordingActEditorComponent,
    RealEstateEditorComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    AngularFlexLayoutModule,
    SharedModule,

    LandControlsModule
  ],
  exports: [
    RecordingActsListComponent,
    RecordingActCreatorComponent,
    RecordingActEditorComponent,
  ]
})
export class RegistrationModule { }
