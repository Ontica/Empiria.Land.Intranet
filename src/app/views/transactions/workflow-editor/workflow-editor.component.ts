import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Assertion, Command } from '@app/core';
import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';
import { TransactionCommandType, TransactionStateSelector } from '@app/core/presentation/presentation-types';
import { EmptyOperation, Operation, TransactionShortModel } from '@app/models';
import { MessageBoxService } from '@app/shared/containers/message-box';
import { FormHandler } from '@app/shared/utils';


enum WorkflowEditorFormControls  {
  operation = 'operation',
  nexStatus = 'nexStatus',
  nextUser = 'nextUser',
  notes = 'notes',
  password = 'password',
}


@Component({
  selector: 'emp-land-workflow-editor',
  templateUrl: './workflow-editor.component.html',
})
export class WorkflowEditorComponent implements OnInit, OnDestroy {

  @Input() transactions: TransactionShortModel[] = [];

  @Output() closeEvent = new EventEmitter<void>();

  helper: SubscriptionHelper;

  applicableOperationsList: Operation[] = [];
  operationSelected: Operation = EmptyOperation;

  formHandler: FormHandler;
  controls = WorkflowEditorFormControls;
  labelNextUser: string;

  constructor(private uiLayer: PresentationLayer,
              private messageBox: MessageBoxService) {
    this.helper = uiLayer.createSubscriptionHelper();
  }

  ngOnInit(): void {
    this.initForm();

    this.helper.select<Operation[]>(TransactionStateSelector.APPLICABLE_OPERATIONS,
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
    return ['AssignTo', 'Receive'].includes(this.operationSelected.type);
  }

  get requiredPasswordField(){
    return ['Sign', 'Unsign'].includes(this.operationSelected.type);
  }

  onClose() {
    this.closeEvent.emit();
  }

  operationChange(change) {
    this.operationSelected = change;

    this.labelNextUser = this.operationSelected.type === 'Receive' ? 'De:' : 'Asignar a:';

    this.setControlsValidators();
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

            this.executeCommand(TransactionCommandType.EXECUTE_WORKFLOW_COMMAND, payload);
          }
        });
  }

  private initForm(){
    this.formHandler = new FormHandler(
      new FormGroup({
        operation: new FormControl('', Validators.required),
        nexStatus: new FormControl(''),
        nextUser: new FormControl(''),
        notes: new FormControl(''),
        password: new FormControl(''),
      })
    );
  }

  private setControlsValidators(){
    this.formHandler.getControl(this.controls.nexStatus).reset();
    this.formHandler.getControl(this.controls.nextUser).reset();
    this.formHandler.getControl(this.controls.password).reset();

    this.formHandler.clearControlValidators(this.controls.nexStatus);
    this.formHandler.clearControlValidators(this.controls.nextUser);
    this.formHandler.clearControlValidators(this.controls.password);

    if (this.requiredNextStatusField) {
      this.formHandler.setControlValidators(this.controls.nexStatus, [Validators.required]);
    }

    if (this.requiredNextUserField) {
      this.formHandler.setControlValidators(this.controls.nextUser, [Validators.required]);
    }

    if (this.requiredPasswordField) {
      this.formHandler.setControlValidators(this.controls.password, [Validators.required]);
    }
  }

  private getConfirmMessage(): string{
    const numTransactions = this.transactions.length;

    const nextStatus = !this.requiredNextStatusField ? '' : this.operationSelected.nextStatus
      .filter(x => x.type === this.formHandler.getControl(this.controls.nexStatus).value)[0].name;

    const nextUser = !this.requiredNextUserField ? '' : this.operationSelected.nextUsers
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

  private getFormData(): any {
    Assertion.assert(this.formHandler.form.valid,
      'Programming error: form must be validated before command execution.');

    const formModel = this.formHandler.form.getRawValue();

    const data: any = {
      transactionUID: this.transactions.map( x => x.uid ),
      nexStatus: formModel.nexStatus ?? '',
      nextUser: formModel.nextUser ?? '',
      notes: formModel.notes ?? '',
      password: formModel.password ?? '',
    };

    return data;
  }

  private executeCommand<T>(commandType: any, payload?: any) {
    const command: Command = {
      type: commandType,
      payload
    };

    setTimeout(() => {
      console.log(command);
      this.onClose();
    }, 500);

    // return this.uiLayer.execute<T>(command);
  }

}
