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

import { MainLayoutModule } from './views/main-layout/main-layout.module';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';


// Define global exception handler provider
import { ErrorHandler } from '@angular/core';
import { ExceptionHandler } from './core/general/exception-handler';

const EXCEPTION_HANDLER_PROVIDER = { provide: ErrorHandler, useClass: ExceptionHandler };

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

  providers: [
    EXCEPTION_HANDLER_PROVIDER
  ]

})
export class AppModule { }
