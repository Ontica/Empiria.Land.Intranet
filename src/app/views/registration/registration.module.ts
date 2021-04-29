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
import { InstrumentBookEntriesModule } from './instrument-book-entries/instrument-book-entries.module';

import { BookEntryEditionComponent } from './recording-book/book-entry-edition.component';
import { BookEntryEditorComponent } from './recording-book/book-entry-editor.component';
import { BookEntryListComponent } from './recording-book/book-entry-list.component';
import {
  RecordableSubjectTabbedViewComponent
} from './recordable-subject-tabbed-view/recordable-subject-tabbed-view.component';
import { RecordingActCreatorComponent } from './recording-acts/recording-act-creator.component';
import { RecordingActEditionComponent } from './recording-acts/recording-act-edition.component';
import { RecordingActEditorComponent } from './recording-acts/recording-act-editor.component';
import { RecordingActsListComponent } from './recording-acts/recording-acts-list.component';
import { RecordingBookEditionComponent } from './recording-book/recording-book-edition.component';
import { RecordingBookSelectorComponent } from './recording-book/recording-book-selector.component';
import { RegistrationMainPageComponent } from './main-page/registration-main-page.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    AngularFlexLayoutModule,
    SharedModule,

    InstrumentBookEntriesModule,
    LandControlsModule,
    RecordableSubjectsModule,
  ],

  declarations: [
    BookEntryEditionComponent,
    BookEntryEditorComponent,
    BookEntryListComponent,
    RecordableSubjectTabbedViewComponent,
    RecordingActCreatorComponent,
    RecordingActEditionComponent,
    RecordingActEditorComponent,
    RecordingActsListComponent,
    RecordingBookEditionComponent,
    RecordingBookSelectorComponent,
    RegistrationMainPageComponent,
  ],

  exports: [
    BookEntryEditionComponent,
    RecordableSubjectTabbedViewComponent,
    RecordingActEditionComponent,
    RecordingBookEditionComponent,
    RegistrationMainPageComponent,
  ]
})
export class RegistrationModule { }
