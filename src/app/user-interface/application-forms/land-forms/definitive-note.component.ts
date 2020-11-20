/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, OnChanges, Output, EventEmitter } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { EventInfo } from '@app/core';

import { EFilingRequest, DefinitiveNote } from '@app/domain/models';

import { ApplicationFormComponent, ApplicationFormHandler } from './common/application-form-handler';


@Component({
  selector: 'emp-land-definitive-note',
  templateUrl: './definitive-note.component.html'
})
export class DefinitiveNoteComponent implements ApplicationFormComponent, OnChanges {

  @Input() request: EFilingRequest;

  @Output() editionEvent = new EventEmitter<EventInfo>();

  form = new FormGroup({
    propertyUID: new FormControl('', Validators.required),
    operation: new FormControl('', Validators.required),
    grantors: new FormControl('', Validators.required),
    grantees: new FormControl('', Validators.required),
    observations: new FormControl(''),
  });

  formHandler: ApplicationFormHandler;


  constructor() {
    this.formHandler = new ApplicationFormHandler(this);
  }


  ngOnChanges() {
    this.resetForm();
  }


  getFormData(): DefinitiveNote {
    const formModel = this.form.value;

    const data = {
      propertyData: { propertyUID: formModel.propertyUID },
      operation: this.formHandler.toUpperCase('operation'),
      grantors: this.formHandler.toUpperCase('grantors'),
      grantees: this.formHandler.toUpperCase('grantees'),
      observations: this.formHandler.toUpperCase('observations')
    };

    return data;
  }


  resetForm() {
    this.formHandler.clearForm();

    if (!this.request.form) {
      return;
    }

    const appForm = this.request.form.fields as DefinitiveNote;

    this.form.reset({
      propertyUID: appForm.propertyData.propertyUID || '',
      operation: appForm.operation || '',
      grantors: appForm.grantors || '',
      grantees: appForm.grantees || '',
      observations: appForm.observations || ''
    });
  }

}
