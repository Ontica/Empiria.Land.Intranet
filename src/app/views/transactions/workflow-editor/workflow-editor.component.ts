import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Assertion, Command } from '@app/core';
import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';
import { TransactionCommandType, TransactionStateSelector } from '@app/core/presentation/presentation-types';
import { EmptyOperation, EmptyWorkflowStatus, TransactionShortModel,
         WorkflowOperation, WorkflowPayload, WorkflowStatus } from '@app/models';
import { MessageBoxService } from '@app/shared/containers/message-box';
import { FormHandler } from '@app/shared/utils';

enum WorkflowEditorFormControls  {
  operation = 'operation',
  nextStatus = 'nextStatus',
  nextUser = 'nextUser',
  note = 'note',
  authorization = 'authorization',
}

@Component({
  selector: 'emp-land-workflow-editor',
  templateUrl: './workflow-editor.component.html',
})
export class WorkflowEditorComponent implements OnInit, OnDestroy {

  @Input() transactions: TransactionShortModel[] = [];

  @Output() closeEvent = new EventEmitter<void>();

  helper: SubscriptionHelper;

  applicableOperationsList: WorkflowOperation[] = [];
  operationSelected: WorkflowOperation = EmptyOperation;
  statusSelected: WorkflowStatus = EmptyWorkflowStatus;

  formHandler: FormHandler;
  controls = WorkflowEditorFormControls;
  labelNextUser: string;

  constructor(private uiLayer: PresentationLayer,
              private messageBox: MessageBoxService) {
    this.helper = uiLayer.createSubscriptionHelper();
  }

  ngOnInit(): void {
    this.initForm();

    this.helper.select<WorkflowOperation[]>(TransactionStateSelector.APPLICABLE_OPERATIONS,
                                    this.transactions.map( x => x.uid ))
      .subscribe(x => {
        this.applicableOperationsList = x;
      });
  }

  ngOnDestroy() {
    this.helper.destroy();
  }

  get requiredNextStatusField(){
    return ['AssignTo', 'SetNextStatus'].includes(this.operationSelected.type);
  }

  get requiredNextUserField(){
    return false;
    // return ['AssignTo', 'Receive'].includes(this.operationSelected.type);
  }

  get requiredAuthorizationField(){
    return false;

    // return ['Sign', 'Unsign'].includes(this.operationSelected.type);
  }

  onClose() {
    this.closeEvent.emit();
  }

  operationChange(change: WorkflowOperation) {
    this.operationSelected = change;

    this.statusSelected = EmptyWorkflowStatus;

    this.labelNextUser = this.operationSelected.type === 'Receive' ? 'De:' : 'Asignar a:';

    this.setControlsValidators();
  }

  statusChange(change: WorkflowStatus) {
    this.statusSelected = change;
  }

  submitTransaction(){
    if (!this.formHandler.isReadyForSubmit) {
      this.formHandler.invalidateForm();
      return;
    }

    const message = this.getConfirmMessage();

    this.messageBox.confirm(message, 'Cambiar estado', 'AcceptCancel')
        .toPromise()
        .then(x => {
          if (x) {
            this.formHandler.submitted = true;

            const payload = {
              type: this.operationSelected.type,
              payload: this.getFormData()
            };

            this.executeCommand(TransactionCommandType.EXECUTE_WORKFLOW_COMMAND, payload)
                .catch(error => {
                  this.handleError(error);
                })
                .finally(() => {
                  this.onClose();
                });
          }
        });
  }

  private initForm(){
    this.formHandler = new FormHandler(
      new FormGroup({
        operation: new FormControl('', Validators.required),
        nextStatus: new FormControl(''),
        nextUser: new FormControl(''),
        note: new FormControl(''),
        authorization: new FormControl(''),
      })
    );
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

  private getConfirmMessage(): string{
    const numTransactions = this.transactions.length;

    const nextStatus = !this.requiredNextStatusField ? '' : this.operationSelected.nextStatus
      .filter(x => x.type === this.formHandler.getControl(this.controls.nextStatus).value)[0].name;

    const nextUser = !this.requiredNextUserField ? '' : this.statusSelected.users
      .filter(x => x.uid === this.formHandler.getControl(this.controls.nextUser).value)[0].name;

    return `
      <table style="margin: 0;">
        <tr><td>Operación: </td> <td> <strong>${this.operationSelected.name} </strong> </td></tr>

        ${!this.requiredNextStatusField ? '' :
        '<tr><td class="nowrap">Nuevo estado: </td><td><strong>' + nextStatus + '</strong></td></tr>'}

        ${!this.requiredNextUserField ? '' :
        '<tr><td>' + this.labelNextUser + '</td><td><strong>' + nextUser + '</strong></td></tr>'}
      </table>

      <br>¿Cambio el estado
      ${numTransactions > 1 ? ' de los ' + numTransactions + ' trámites seleccionados' : ' del trámite'}?`;
  }

  private getFormData(): WorkflowPayload {
    Assertion.assert(this.formHandler.form.valid,
      'Programming error: form must be validated before command execution.');

    const formModel = this.formHandler.form.getRawValue();

    const data: WorkflowPayload = {
      transactionUID: this.transactions.map( x => x.uid ),
      nextStatus: formModel.nextStatus ?? '',
      assignToUID: formModel.nextUser ?? '',
      note: formModel.note ?? '',
      authorization: formModel.authorization ?? '',
    };

    return data;
  }

  private executeCommand<T>(commandType: any, payload?: any): Promise<T> {
    const command: Command = {
      type: commandType,
      payload
    };

    return this.uiLayer.execute<T>(command);
  }

  private handleError(error){
    if ([400, 500].includes(error.status)) {
      this.messageBox.show(error.error.message, 'Ocurió un problema');
    }
  }

}
