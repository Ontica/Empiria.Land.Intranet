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

import { LandControlsModule } from '../land-controls/land.controls.module';
import { RecordableSubjectsModule } from '../recordable-subjects/recordable-subjects.module';

import { InstrumentBookEntriesModule } from '../registration/instrument-book-entries/instrument-book-entries.module';

import { BookEntryEditionComponent } from './recording-book/book-entry-edition.component';
import { BookEntryEditorComponent } from './recording-book/book-entry-editor.component';
import { BookEntryListComponent } from './recording-book/book-entry-list.component';
import { InstrumentBookEntryCreatorComponent } from '../registration/instrument-book-entries/instrument-book-entry-creator.component';
import { InstrumentBookEntryListComponent } from '../registration/instrument-book-entries/instrument-book-entry-list.component';
import { InstrumentEditorComponent } from '../recordable-subjects/instrument/instrument-editor.component';
import { RecordableSubjectEditorComponent } from './recordable-subject/recordable-subject-editor.component';
import { RecordableSubjectHistoryComponent } from './recordable-subject/recordable-subject-history.component';
import { RecordingActCreatorComponent } from './recording-acts/recording-act-creator.component';
import { RecordingActCreatorModalComponent } from './recording-acts/recording-act-creator-modal.component';
import { RecordingActEditionComponent } from './recording-acts/recording-act-edition.component';
import { RecordingActEditionModalComponent } from './recording-acts/recording-act-edition-modal.component';
import { RecordingActEditorComponent } from './recording-acts/recording-act-editor.component';
import { RecordingActsListComponent } from './recording-acts/recording-acts-list.component';
import { RecordingBookEditionComponent } from './recording-book/recording-book-edition.component';
import { RegistryEntryEditorComponent } from './registry-entry/registry-entry-editor.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    SharedModule,

    InstrumentBookEntriesModule,
    LandControlsModule,
    RecordableSubjectsModule,
  ],

  declarations: [
    BookEntryEditionComponent,
    BookEntryEditorComponent,
    BookEntryListComponent,
    RecordableSubjectEditorComponent,
    RecordableSubjectHistoryComponent,
    RecordingActCreatorComponent,
    RecordingActCreatorModalComponent,
    RecordingActEditionComponent,
    RecordingActEditionModalComponent,
    RecordingActEditorComponent,
    RecordingActsListComponent,
    RecordingBookEditionComponent,
    RegistryEntryEditorComponent,
  ],

  exports: [
    BookEntryEditionComponent,
    InstrumentBookEntryCreatorComponent,
    InstrumentBookEntryListComponent,
    InstrumentEditorComponent,
    RecordableSubjectEditorComponent,
    RecordingActCreatorComponent,
    RecordingActEditionComponent,
    RecordingActsListComponent,
    RecordingBookEditionComponent,
    RegistryEntryEditorComponent,
  ]
})
export class RegistrationModule { }
