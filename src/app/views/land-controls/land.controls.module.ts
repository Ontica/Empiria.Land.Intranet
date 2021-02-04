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

import { RecordingSeekFormComponent } from './recording-seek-form/recording-seek-form.component';

import {
  RealPropertyUIDPickerComponent
 } from './real-property-uid-picker/real-property-uid-picker.component';
import { FileViewerComponent } from './file-viewer/file-viewer.component';
import { SharedPipesModule } from '@app/shared/pipes/shared-pipes.module';


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
    SharedPipesModule,
  ],

  declarations: [
    RecordingSeekFormComponent,
    RealPropertyUIDPickerComponent,
    FileViewerComponent,
  ],

  exports: [
    RecordingSeekFormComponent,
    RealPropertyUIDPickerComponent,
    FileViewerComponent,
  ]

})
export class LandControlsModule { }
