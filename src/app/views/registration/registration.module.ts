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
import { RecordingBooksModule } from './recording-books/recording-books.module';

import { RecordingActsListComponent } from './recording-acts/recording-acts-list.component';
import { RecordingActCreatorComponent } from './recording-acts/recording-act-creator.component';
import { RecordingBookSelectorComponent } from './recording-acts/recording-book-selector.component';
import { RegistrationMainPageComponent } from './main-page/registration-main-page.component';
import {
  RecordableSubjectTabbedViewComponent
} from './recordable-subject-tabbed-view/recordable-subject-tabbed-view.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    AngularFlexLayoutModule,
    SharedModule,

    LandControlsModule,
    RecordingBooksModule,
    RecordableSubjectsModule,
  ],

  declarations: [
    RecordingActsListComponent,
    RecordingActCreatorComponent,
    RecordingBookSelectorComponent,
    RegistrationMainPageComponent,
    RecordableSubjectTabbedViewComponent,
  ],

  exports: [
    RecordingActsListComponent,
    RecordingActCreatorComponent,
    RegistrationMainPageComponent,
    RecordableSubjectTabbedViewComponent,
  ]
})
export class RegistrationModule { }
