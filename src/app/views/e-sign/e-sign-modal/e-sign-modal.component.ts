/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Empty, EventInfo, Identifiable } from '@app/core';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { sendEvent } from '@app/shared/utils';

import { ESignDataService } from '@app/data-services';

import { ESignCommand, ESignOperationType, TransactionDescriptor } from '@app/models';

export enum ESignModalEventType {
  OPERATION_EXECUTED   = 'ESignModalComponent.Event.OperationExecuted',
  CLOSE_BUTTON_CLICKED = 'ESignModalComponent.Event.CloseButtonClicked',
}

@Component({
  selector: 'emp-land-e-sign-modal',
  templateUrl: './e-sign-modal.component.html',
})
export class ESignModalComponent {

  @Input() operation: Identifiable = Empty;

  @Input() transactionList: TransactionDescriptor[] = [];

  @Output() eSignModalEvent = new EventEmitter<EventInfo>();

  showPassword = false;

  submitted = false;

  form = new FormGroup({
    userID: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  exceptionMsg: string;


  constructor(private eSignData: ESignDataService,
              private messageBox: MessageBoxService) {

  }


  onCloseClicked() {
    sendEvent(this.eSignModalEvent, ESignModalEventType.CLOSE_BUTTON_CLICKED);
  }


  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }


  onExecuteOperationClicked() {
    if (this.form.invalid || this.submitted) {
      this.form.markAllAsTouched();
      return;
    }

    switch (this.operation.uid as ESignOperationType) {
      case ESignOperationType.Sign:
        this.executeOperation(this.buildCommandToExecute());
        return;

      case ESignOperationType.Revoke:
      case ESignOperationType.Refuse:
      case ESignOperationType.Unrefuse:
        this.messageBox.showInDevelopment(this.operation.name);
        return;

      default:
        console.log(`Unhandled user interface operation ${this.operation.uid}`);
        return;
    }

  }


  private buildCommandToExecute(): ESignCommand {
    const command: ESignCommand = {
      commandType: this.operation.uid as ESignOperationType,
      credentials: {
        userID: this.form.value.userID,
        password: this.form.value.password,
      },
      transactionUIDs: this.transactionList.map(x => x.uid),
    };

    return command;
  }


  private executeOperation(command: ESignCommand) {
    this.submitted = true;

    this.eSignData.signMyTransactionDocuments(command)
      .then(
        x => this.emitOperationExecuted(),
        error => this.exceptionMsg = error.message
      )
      .finally(() => this.submitted = false);
  }


  private emitOperationExecuted() {
    sendEvent(this.eSignModalEvent, ESignModalEventType.OPERATION_EXECUTED);
  }

}
