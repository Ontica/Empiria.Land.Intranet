/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { NgSelectModule } from '@ng-select/ng-select';

import { AngularMaterialModule } from '../angular-material.module';

import { DatePickerComponent } from './date-picker/date-picker.component';
import { SearchBoxComponent } from './search-box/search-box.component';
import { SelectBoxComponent } from './select-box/select-box.component';
import { TextEditorComponent } from './text-editor/text-editor.component';


@NgModule({

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    NgSelectModule,
    QuillModule.forRoot()
  ],

  declarations: [
    DatePickerComponent,
    SearchBoxComponent,
    SelectBoxComponent,
    TextEditorComponent,
  ],

  exports: [
    DatePickerComponent,
    SearchBoxComponent,
    SelectBoxComponent,
    TextEditorComponent,
  ]

})
export class SharedFormControlsModule { }
