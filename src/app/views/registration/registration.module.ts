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
import { RecordableSubjectsModule } from '../recordable-subjects/recordable-subjects.module';
import { PhysicalRecordingModule } from './physical-recording/physical-recording.module';

import { RecordingActCreatorComponent } from './recording-act-creator/recording-act-creator.component';
import { RecordingActDataEditorComponent }
  from './recording-act-data-editor/recording-act-data-editor.component';
import { RecordingActsListComponent } from './recording-acts-list/recording-acts-list.component';
import { RegistrationMainPageComponent } from './main-page/registration-main-page.component';
import { RecordableSubjectTabbedViewComponent }
  from './recordable-subject-tabbed-view/recordable-subject-tabbed-view.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    AngularFlexLayoutModule,
    SharedModule,

    LandControlsModule,
    PhysicalRecordingModule,
    RecordableSubjectsModule,
  ],

  declarations: [
    RecordingActsListComponent,
    RecordingActCreatorComponent,
    RecordingActDataEditorComponent,
    RegistrationMainPageComponent,
    RecordableSubjectTabbedViewComponent,
  ],

  exports: [
    RecordingActsListComponent,
    RecordingActCreatorComponent,
    RecordingActDataEditorComponent,
    RegistrationMainPageComponent,
    RecordableSubjectTabbedViewComponent,
  ]
})
export class RegistrationModule { }