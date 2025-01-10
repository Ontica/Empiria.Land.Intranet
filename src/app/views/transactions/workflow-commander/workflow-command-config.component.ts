/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion } from '@app/core';

import { debounceTime, distinctUntilChanged } from 'rxjs';

import { FormHelper } from '@app/shared/utils';

import { EmptyApplicableCommand, EmptyWorkflowStatus, ApplicableCommand, WorkflowPayload, WorkflowStatus,
         WorkflowCommandType } from '@app/models';


interface WorkflowCommandConfigFormModel extends FormGroup<{
  command: FormControl<string>;
  nextStatus: FormControl<string>;
  nextUser: FormControl<string>;
  note: FormControl<string>;
  authorization: FormControl<string>;
}> {}

export interface FormDataEmitted {
  commandType: WorkflowCommandType;
  formData: WorkflowPayload;
  isValid: boolean;
}

@Component({
  selector: 'emp-land-workflow-command-config',
  templateUrl: './workflow-command-config.component.html',
})
export class WorkflowCommandConfigComponent implements OnInit {

  @Input() applicableCommandsList: ApplicableCommand[] = [];

  @Output() formData = new EventEmitter<FormDataEmitted>();

  commandSelected: ApplicableCommand = EmptyApplicableCommand;

  statusSelected: WorkflowStatus = EmptyWorkflowStatus;

  form: WorkflowCommandConfigFormModel;

  formHelper = FormHelper;

  labelNextUser: string;


  ngOnInit() {
    this.initForm();
  }


  get requiredNextStatusField(): boolean {
    return ['AssignTo', 'SetNextStatus'].includes(this.commandSelected.type);
  }


  get requiredNextUserField(): boolean {
    return false; // ['AssignTo', 'Receive'].includes(this.commandSelected.type);
  }


  get requiredAuthorizationField(): boolean {
    return false; // ['Sign', 'Unsign'].includes(this.commandSelected.type);
  }


  onCommandChanges(change: ApplicableCommand) {
    this.commandSelected = change;
    this.statusSelected = EmptyWorkflowStatus;
    this.labelNextUser = this.commandSelected.type === 'Receive' ? 'De:' : 'Asignar a:';
    this.setControlsValidators();
    this.formHelper.markFormControlsAsTouched(this.form);
  }

  onStatusChanges(change: WorkflowStatus) {
    this.statusSelected = change;
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      command: ['', Validators.required],
      nextStatus: [''],
      nextUser: [''],
      note: [''],
      authorization: [''],
    });

    this.onSuscribeToFormValueChanges();
  }


  private onSuscribeToFormValueChanges(): void {
    this.form.valueChanges
      .pipe(distinctUntilChanged(), debounceTime(100))
      .subscribe(value => {
        this.formData.emit({
          commandType: this.form.value.command as WorkflowCommandType,
          formData: this.formHelper.isFormReady(this.form) ? this.getFormData() : {},
          isValid: this.formHelper.isFormReady(this.form)
        });
      });
  }


  private setControlsValidators() {
    this.form.controls.nextStatus.reset();
    this.form.controls.nextUser.reset();
    this.form.controls.authorization.reset();

    this.formHelper.clearControlValidators(this.form.controls.nextStatus);
    this.formHelper.clearControlValidators(this.form.controls.nextUser);
    this.formHelper.clearControlValidators(this.form.controls.authorization);

    if (this.requiredNextStatusField) {
      this.formHelper.setControlValidators(this.form.controls.nextStatus, [Validators.required]);
    }

    if (this.requiredNextUserField) {
      this.formHelper.setControlValidators(this.form.controls.nextUser, [Validators.required]);
    }

    if (this.requiredAuthorizationField) {
      this.formHelper.setControlValidators(this.form.controls.authorization, [Validators.required]);
    }
  }


  private getFormData(): WorkflowPayload {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const formModel = this.form.getRawValue();

    const data: WorkflowPayload = {
      transactionUID: [],
      nextStatus: formModel.nextStatus ?? '',
      assignToUID: formModel.nextUser ?? '',
      note: formModel.note ?? '',
      authorization: formModel.authorization ?? '',
    };

    return data;
  }

}
