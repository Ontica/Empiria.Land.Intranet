/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { BrowserModule } from '@angular/platform-browser';

import { NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CoreModule } from './core/core.module';

import { MainLayoutModule } from '@app/main-layout/main-layout.module';

import { AppComponent } from './app.component';

import { AppRoutingModule } from './app-routing.module';


@NgModule({

  bootstrap: [ AppComponent ],

  declarations: [
    AppComponent
  ],

  imports: [
    BrowserModule,
    BrowserAnimationsModule,

    CoreModule,
    MainLayoutModule,

    AppRoutingModule
  ],

})
export class AppModule { }
