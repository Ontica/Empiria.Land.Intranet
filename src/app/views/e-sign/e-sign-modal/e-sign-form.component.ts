/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, EventInfo } from '@app/core';

import { FormHelper, sendEvent } from '@app/shared/utils';

import { ESignCredentials } from '@app/models';

export enum ESignFormEventType {
  EXECUTE_OPERATION_BUTTON_CLICKED = 'ESignFormComponent.Event.ExecuteOperationButtonClicked',
}

@Component({
  selector: 'emp-land-e-sign-form',
  templateUrl: './e-sign-form.component.html',
})
export class ESignFormComponent  {

  @Input() buttonText: string = 'Ejecutar';

  @Input() exceptionMsg: string = '';

  @Output() eSignFormEvent = new EventEmitter<EventInfo>();

  showPassword = false;

  form = new FormGroup({
    userID: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  formHelper = FormHelper;


  onToggleShowPasswordClicked() {
    this.showPassword = !this.showPassword;
  }


  onExecuteOperationClicked() {
    if (!this.formHelper.isFormReadyAndInvalidate(this.form)) {
      return;
    }

    const payload = {
      credentials: this.getFormData(),
    };

    sendEvent(this.eSignFormEvent, ESignFormEventType.EXECUTE_OPERATION_BUTTON_CLICKED, payload);
  }


  private getFormData(): ESignCredentials {
    Assertion.assert(this.form.valid,
      'Programming error: form must be validated before command execution.');

    const formModel = this.form.getRawValue();

    const data: ESignCredentials = {
      userID: formModel.userID ?? '',
      password: formModel.password ?? '',
    };

    return data;
  }

}
