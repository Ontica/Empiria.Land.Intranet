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

import { FileViewerComponent } from './file-viewer/file-viewer.component';
import { FileViewerNavigatorComponent } from './file-viewer/file-viewer-navigator.component';

import { RecordingBookSelectorComponent } from './recording-book-selector/recording-book-selector.component';


@NgModule({

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AngularMaterialModule,
    AngularFlexLayoutModule,
    SharedModule,
  ],

  declarations: [
    FileViewerComponent,
    FileViewerNavigatorComponent,

    RecordingBookSelectorComponent,
  ],

  exports: [
    FileViewerComponent,

    RecordingBookSelectorComponent,
  ]

})
export class LandControlsModule { }
