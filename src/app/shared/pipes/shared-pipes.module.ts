/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SafeHtmlPipe } from './safe-html.pipe';
import { SafeUrlPipe } from './safe-url.pipe';


@NgModule({

  imports: [
    CommonModule,
  ],

  declarations: [
    SafeHtmlPipe,
    SafeUrlPipe,
  ],

  exports: [
    SafeHtmlPipe,
    SafeUrlPipe
  ],


})
export class SharedPipesModule { }
