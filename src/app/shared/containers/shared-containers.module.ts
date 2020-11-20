/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AngularMaterialModule } from '../angular-material.module';

import { SharedPipesModule } from '../pipes/shared-pipes.module';

import { CardComponent } from './card/card.component';
import { ModalWindowComponent } from './modal-window/modal-window';

@NgModule({

  imports: [
    CommonModule,

    AngularMaterialModule,

    SharedPipesModule
  ],

  declarations: [
    CardComponent,
    ModalWindowComponent,
  ],

  exports: [
    CardComponent,
    ModalWindowComponent
  ]

})
export class SharedContainersModule { }
