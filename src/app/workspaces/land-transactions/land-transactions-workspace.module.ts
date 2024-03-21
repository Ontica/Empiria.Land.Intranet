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

import { LandTransactionsWorkspaceRoutingModule } from './land-transactions-workspace-routing.module';

import { LandControlsModule } from '@app/views/land-controls/land.controls.module';
import { LandListModule } from '@app/views/land-list/land-list.module';
import { TransactionsModule } from '@app/views/transactions/transactions.module';
import { CertificateEmissionModule } from '@app/views/certificate-emission/certificate-emission.module';
import { RegistrationModule } from '@app/views/registration/registration.module';

import { TransactionsMainPageComponent } from './transactions-main-page/transactions-main-page.component';
import { LandTransactionTabbedViewComponent } from './transactions-main-page/parts/land-transaction-tabbed-view.component';
import { LandPreRegistationComponent } from './transactions-main-page/parts/land-pre-registration.component';
import { LandRegistrationComponent } from './transactions-main-page/parts/land-registration.component';
import { LandCertificationComponent } from './transactions-main-page/parts/land-certification.component';


@NgModule({

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AngularMaterialModule,
    AngularFlexLayoutModule,
    SharedModule,

    LandControlsModule,
    LandListModule,
    CertificateEmissionModule,
    RegistrationModule,
    TransactionsModule,

    LandTransactionsWorkspaceRoutingModule,
  ],

  declarations: [
    TransactionsMainPageComponent,
    LandTransactionTabbedViewComponent,
    LandCertificationComponent,
    LandPreRegistationComponent,
    LandRegistrationComponent,
  ],

  exports: [

  ]

})
export class LandTransactionsWorkpaceModule { }
