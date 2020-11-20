/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Assertion, EventInfo } from '@app/core';

import { ElectronicFilingCommandType } from '@app/core/presentation/commands';

import { ApplicationFormFields, EFilingRequest } from '@app/domain/models';


export interface ApplicationFormComponent {
  request: EFilingRequest;

  editionEvent: EventEmitter<EventInfo>;

  form: FormGroup;

  getFormData(): ApplicationFormFields;

  resetForm();
}


export class ApplicationFormHandler {
  editionMode = false;
  exceptionMsg = '';
  isLoading = false;
  submitted = false;

  private appFormComponent: ApplicationFormComponent;


  constructor(appFormComponent: ApplicationFormComponent) {
    this.appFormComponent = appFormComponent;
  }


  get canDelete() {
    return (this.editionMode && !this.readonly &&
           (!this.appFormComponent.request.transaction || !this.appFormComponent.request.transaction.uid));
  }

  get canEdit() {
    return (!this.editionMode && !this.readonly);
  }

  get isReadyForSave() {
    return (!this.appFormComponent.form.pristine && !this.readonly);
  }

  get readonly() {
    return (this.appFormComponent.request.esign && this.appFormComponent.request.esign.sign);
  }

  onCancel() {
    this.appFormComponent.resetForm();
  }

  onDelete() {
    const msg = '¿Elimino este trámite?';

    if (!confirm(msg)) {
      return null;
    }

    const event: EventInfo = {
      type: ElectronicFilingCommandType.DELETE_EFILING_REQUEST,
      payload: {
        request: this.appFormComponent.request
      }
    };

    this.appFormComponent.editionEvent.emit(event);
  }


  onEdit(afterEditDoThis?: () => void) {
    if (this.readonly) {
      return;
    }

    this.editionMode = true;
    this.appFormComponent.form.enable();

    if (afterEditDoThis) {
      afterEditDoThis();
    }
  }


  onSubmit(onSubmitValidationHandler?: () => void) {
    if (!this.isReadyForSave) {
      return;
    }

    this.submitted = true;

    if (onSubmitValidationHandler) {
      onSubmitValidationHandler();
    }

    if (this.appFormComponent.form.valid) {
      this.sendUpdateApplicationFormEvent();
      this.editionMode = false;
      this.appFormComponent.form.disable();
    }
  }


  clearForm() {
    this.editionMode = false;
    this.exceptionMsg = '';
    this.submitted = false;

    this.appFormComponent.form.disable();

    this.appFormComponent.form.reset();
  }


  setControlAsOptional(controlName: string) {
    const control = this.appFormComponent.form.get(controlName);

    control.setErrors(null);
  }


  setControlAsRequired(controlName: string, noValidMessage?: string) {
    const control = this.appFormComponent.form.get(controlName);

    if (control.value === '' || control.value === 'null') {
      control.setErrors({ required: true });
      this.exceptionMsg = noValidMessage ? noValidMessage : '';
    }
  }


  toUpperCase(controlName: string) {
    const control = this.appFormComponent.form.get(controlName);

    if (!control) {
      console.log('Invalid control name', controlName);
      return '';
    }

    if (control.value) {
      return (control.value as string).toUpperCase();
    } else {
      return '';
    }
  }


  // private methods


  private sendUpdateApplicationFormEvent() {
    Assertion.assert(this.appFormComponent.form.valid,
                    'Programming error: form must be validated before command execution.');

    const event: EventInfo = {
      type: ElectronicFilingCommandType.UPDATE_APPLICATION_FORM,
      payload: {
        request: this.appFormComponent.request,
        form: this.appFormComponent.getFormData()
      }
    };

    this.appFormComponent.editionEvent.emit(event);
  }

}
