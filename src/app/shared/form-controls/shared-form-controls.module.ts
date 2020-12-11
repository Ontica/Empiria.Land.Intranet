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

import { SearchBoxComponent } from './search-box/search-box.component';
import { TextEditorComponent } from './text-editor/text-editor.component';
import { SelectBoxComponent } from './select-box/select-box.component';


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
    SearchBoxComponent,
    TextEditorComponent,
    SelectBoxComponent
  ],

  exports: [
    SearchBoxComponent,
    TextEditorComponent,
    SelectBoxComponent
  ]

})
export class SharedFormControlsModule { }
