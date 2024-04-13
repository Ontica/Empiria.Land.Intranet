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

import { CertificateCreatorComponent } from './certificate-creator.component';
import { CertificateEditionComponent } from './certificate-edition.component';
import { CertificateListComponent } from './certificate-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AngularMaterialModule,
    SharedModule,

    LandControlsModule,
  ],

  declarations: [
    CertificateCreatorComponent,
    CertificateEditionComponent,
    CertificateListComponent,
  ],

  exports: [
    CertificateCreatorComponent,
    CertificateEditionComponent,
    CertificateListComponent,
  ]
})
export class CertificateEmissionModule { }
