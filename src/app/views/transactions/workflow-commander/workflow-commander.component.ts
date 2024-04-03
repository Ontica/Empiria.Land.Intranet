/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { Assertion, Command, EventInfo } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { TransactionCommandType, TransactionStateSelector } from '@app/core/presentation/presentation-types';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { ArrayLibrary, sendEvent } from '@app/shared/utils';

import { TransactionDescriptor, ApplicableCommand, WorkflowCommand, WorkflowTask } from '@app/models';

import { ListSelectorEventType } from '@app/views/land-list/land-list-selector/land-list-selector.component';

import { FormDataEmitted } from './workflow-command-config.component';


export enum WorkflowCommanderEventType {
  CLOSE_BUTTON_CLICKED      = 'WorkflowCommanderComponent.Event.CloseButtonClicked',
  WORKFLOW_COMMAND_EXECUTED = 'WorkflowCommanderComponent.Event.WorkflowCommandExecuted',
}

@Component({
  selector: 'emp-land-workflow-commander',
  templateUrl: './workflow-commander.component.html',
})
export class WorkflowCommanderComponent implements OnInit, OnDestroy {

  @Input() transactionList: TransactionDescriptor[] = [];

  @Input() canEditList = true;

  @Input() titleText = '';

  @Input() applyEffects = true;

  @Output() workflowCommanderEvent = new EventEmitter<EventInfo>();

  helper: SubscriptionHelper;

  applicableCommandsList: ApplicableCommand[] = [];

  allCommandsMode = false;

  formWorkflow: FormDataEmitted = {
    commandType: null,
    formData: null,
    isValid: false,
  };

  submitted = false;


  constructor(private uiLayer: PresentationLayer,
              private messageBox: MessageBoxService) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit() {
    this.initWorkflowCommanderMode();
    this.loadCommandList();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  onCloseClicked() {
    sendEvent(this.workflowCommanderEvent, WorkflowCommanderEventType.CLOSE_BUTTON_CLICKED);
  }


  onWorkflowCommandConfigEvent(event: FormDataEmitted) {
    this.formWorkflow = event;
  }


  onTransactionListSelectorEvent(event: EventInfo) {
    switch (event.type as ListSelectorEventType) {

      case ListSelectorEventType.FILTER_CHANGED:
        this.searchTransaction(event.payload);
        return;

      case ListSelectorEventType.ITEMS_LIST_CHANGED:
        Assertion.assertValue(event.payload.itemsList, 'event.payload.itemsList');
        this.transactionList = event.payload.itemsList;
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onSubmitButtonClicked() {
    if (this.submitted || !this.formWorkflow.isValid || this.transactionList.length === 0) {
      return;
    }

    this.messageBox.confirm(this.getConfirmMessage(), 'Cambiar estado', 'AcceptCancel')
      .toPromise()
      .then(x => {
        if (x) {
          this.formWorkflow.formData.transactionUID = this.transactionList.map(t => t.uid);

          const command: WorkflowCommand = {
            type: this.formWorkflow.commandType,
            payload: this.formWorkflow.formData
          };

          this.executeWorkflowCommand(command);
        }
      });
  }


  private initWorkflowCommanderMode() {
    this.allCommandsMode = this.transactionList.length === 0;
    this.titleText = this.allCommandsMode ? 'Paquete de trámites' : 'Cambio de estado';
  }


  private loadCommandList() {
    const selector = this.allCommandsMode ?
      TransactionStateSelector.ALL_AVAILABLE_COMMANDS :
      TransactionStateSelector.APPLICABLE_COMMANDS;

    const params = this.allCommandsMode ? null : this.transactionList.map(x => x.uid);

    this.helper.select<ApplicableCommand[]>(selector, params)
      .subscribe(x => this.applicableCommandsList = x);
  }


  private searchTransaction(data: { searchUID: string }) {
    const workflowCommand: WorkflowCommand = {
      type: this.formWorkflow.commandType,
      payload: data
    };

    if (this.formWorkflow.formData.nextStatus) {
      workflowCommand.payload.nextStatus = this.formWorkflow.formData.nextStatus;
    }

    this.helper.select<TransactionDescriptor>(TransactionStateSelector.TRANSACTION_FROM_COMMAND_EXECUTION,
      workflowCommand)
      .toPromise()
      .then(x => {
        this.handleTransactionDuplicate(data.searchUID, x.uid);
        this.transactionList = ArrayLibrary.insertItemTop(this.transactionList, x, 'uid');
      });
  }


  private executeWorkflowCommand(workflowCommand: WorkflowCommand) {
    this.submitted = true;

    const command: Command = {
      type: TransactionCommandType.EXECUTE_WORKFLOW_COMMAND,
      payload: workflowCommand,
      applyEffects: this.applyEffects,
    };

    this.uiLayer.execute<WorkflowTask[]>(command)
      .then(x => this.resolveWorkflowCommandExecuted(x))
      .finally(() => this.submitted = false);
  }


  private getConfirmMessage(): string {
    const numTransactions = this.transactionList.length;

    const commandType = this.applicableCommandsList.find(x => x.type === this.formWorkflow.commandType);

    const nextStatus = !this.formWorkflow.formData.nextStatus ? null :
      commandType.nextStatus.find(x => x.type === this.formWorkflow.formData.nextStatus);

    const nextUser = !this.formWorkflow.formData.assignToUID ? null :
      nextStatus.users.find(x => x.uid === this.formWorkflow.formData.assignToUID);

    const labelNextUser = commandType.type === 'Receive' ? 'De:' : 'Asignar a:';

    return `
      <table class='confirm-data'>
        <tr><td>Operación: </td> <td> <strong>${commandType.name} </strong> </td></tr>
        ${!nextStatus ? '' : '<tr><td>Nuevo estado: </td><td><strong>' + nextStatus.name + '</strong></td></tr>'}
        ${!nextUser ? '' : '<tr><td>' + labelNextUser + '</td><td><strong>' + nextUser.name + '</strong></td></tr>'}
      </table>
      <br>¿Cambio el estado
      ${numTransactions > 1 ? ' de los ' + numTransactions + ' trámites seleccionados' : ' del trámite'}?`;
  }


  private handleTransactionDuplicate(keyword: string, transactionUID: string) {
    if (this.transactionList.filter(t => t.uid === transactionUID).length > 0) {
      this.messageBox.show(`El trámite '${keyword}' ya se encuentra en la lista.`, 'Trámite duplicado');
    }
  }


  private resolveWorkflowCommandExecuted(workflowTasks: WorkflowTask[]) {
    sendEvent(this.workflowCommanderEvent,
      WorkflowCommanderEventType.WORKFLOW_COMMAND_EXECUTED, { workflowTasks });
  }

}
