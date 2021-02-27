/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmpCurrencyDirective } from './currency.directive';
import { EmpIntegerDirective } from './integer.directive';
import { EmpTextareaAutoresizeDirective } from './text-area-autoresize.directive';


@NgModule({

  imports: [
    CommonModule,
  ],

  declarations: [
    EmpCurrencyDirective,
    EmpIntegerDirective,
    EmpTextareaAutoresizeDirective,
  ],

  exports: [
    EmpCurrencyDirective,
    EmpIntegerDirective,
    EmpTextareaAutoresizeDirective,
  ],

})
export class SharedDirectivesModule { }
