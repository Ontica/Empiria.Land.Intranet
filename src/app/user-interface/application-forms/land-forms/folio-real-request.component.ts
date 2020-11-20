/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, OnChanges, Output, EventEmitter } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { EventInfo } from '@app/core';

import { FolioRealRequest, EFilingRequest } from '@app/domain/models';

import { ApplicationFormComponent, ApplicationFormHandler } from './common/application-form-handler';


@Component({
  selector: 'emp-land-folio-real-request',
  templateUrl: './folio-real-request.component.html'
})
export class FolioRealRequestComponent implements ApplicationFormComponent, OnChanges {

  @Input() request: EFilingRequest;

  @Output() editionEvent = new EventEmitter<EventInfo>();

  form = new FormGroup({
    antecedent: new FormControl('', Validators.required),
    propertyDescription: new FormControl('', Validators.required),
    observations: new FormControl(''),
  });

  formHandler: ApplicationFormHandler;


  constructor() {
    this.formHandler = new ApplicationFormHandler(this);
  }


  ngOnChanges() {
    this.resetForm();
  }


  getFormData(): FolioRealRequest {
    const data = {
      antecedent: this.formHandler.toUpperCase('antecedent'),
      propertyDescription: this.formHandler.toUpperCase('propertyDescription'),
      observations: this.formHandler.toUpperCase('observations')
    };

    return data;
  }


  resetForm() {
    this.formHandler.clearForm();

    if (!this.request.form) {
      return;
    }

    const appForm = this.request.form.fields as FolioRealRequest;

    this.form.reset({
      antecedent: appForm.antecedent || '',
      propertyDescription: appForm.propertyDescription || '',
      observations: appForm.observations || ''
    });
  }

}
