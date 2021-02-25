import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Assertion } from '@app/core';
import { EmptyApplicableCommand, EmptyWorkflowStatus,
         ApplicableCommand, WorkflowPayload, WorkflowStatus, WorkflowCommandType } from '@app/models';
import { FormHandler } from '@app/shared/utils';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

enum WorkflowCommandConfigControls {
  command = 'command',
  nextStatus = 'nextStatus',
  nextUser = 'nextUser',
  note = 'note',
  authorization = 'authorization',
}

export interface FormDataEmitted {
  commandType: WorkflowCommandType;
  formData: any;
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

  formHandler: FormHandler;
  controls = WorkflowCommandConfigControls;
  labelNextUser: string;

  constructor() {

  }

  ngOnInit(): void {
    this.initForm();
  }

  get requiredNextStatusField(){
    return ['AssignTo', 'SetNextStatus'].includes(this.commandSelected.type);
  }

  get requiredNextUserField(){
    return false;
    // return ['AssignTo', 'Receive'].includes(this.commandSelected.type);
  }

  get requiredAuthorizationField(){
    return false;
    // return ['Sign', 'Unsign'].includes(this.commandSelected.type);
  }

  commandChange(change: ApplicableCommand) {
    this.commandSelected = change;

    this.statusSelected = EmptyWorkflowStatus;

    this.labelNextUser = this.commandSelected.type === 'Receive' ? 'De:' : 'Asignar a:';

    this.setControlsValidators();

    this.formHandler.invalidateForm();
  }

  statusChange(change: WorkflowStatus) {
    this.statusSelected = change;
  }

  private initForm(){
    this.formHandler = new FormHandler(
      new FormGroup({
        command: new FormControl('', Validators.required),
        nextStatus: new FormControl(''),
        nextUser: new FormControl(''),
        note: new FormControl(''),
        authorization: new FormControl(''),
      })
    );

    this.onFormValueChanges();
  }

  private onFormValueChanges(): void {
    this.formHandler.form.valueChanges
      .pipe(distinctUntilChanged(), debounceTime(100))
      .subscribe(value => {
        this.formData.emit({
          commandType: this.formHandler.getControl(this.controls.command).value,
          formData: this.formHandler.isValid ? this.getFormData() : {},
          isValid: this.formHandler.isValid
        });
    });
  }

  private setControlsValidators(){
    this.formHandler.getControl(this.controls.nextStatus).reset();
    this.formHandler.getControl(this.controls.nextUser).reset();
    this.formHandler.getControl(this.controls.authorization).reset();

    this.formHandler.clearControlValidators(this.controls.nextStatus);
    this.formHandler.clearControlValidators(this.controls.nextUser);
    this.formHandler.clearControlValidators(this.controls.authorization);

    if (this.requiredNextStatusField) {
      this.formHandler.setControlValidators(this.controls.nextStatus, [Validators.required]);
    }

    if (this.requiredNextUserField) {
      this.formHandler.setControlValidators(this.controls.nextUser, [Validators.required]);
    }

    if (this.requiredAuthorizationField) {
      this.formHandler.setControlValidators(this.controls.authorization, [Validators.required]);
    }
  }

  private getFormData(): WorkflowPayload {
    Assertion.assert(this.formHandler.form.valid,
      'Programming error: form must be validated before command execution.');

    const formModel = this.formHandler.form.getRawValue();

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
