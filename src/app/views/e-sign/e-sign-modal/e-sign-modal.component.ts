/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, Empty, EventInfo, Identifiable } from '@app/core';

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
export class ESignModalComponent implements OnInit {

  @Input() operation: Identifiable = Empty;

  @Input() transactionList: TransactionDescriptor[] = [];

  @Output() eSignModalEvent = new EventEmitter<EventInfo>();

  title = '';

  showPassword = false;

  submitted = false;

  form = new FormGroup({
    userID: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  exceptionMsg: string;


  constructor(private eSignData: ESignDataService) {

  }


  ngOnInit() {
    if (this.transactionList.length === 1) {
      this.title = this.operation.name + ' (' + this.transactionList.length + ' trámite seleccionado)'
    } else {
      this.title = this.operation.name + ' (' + this.transactionList.length + ' trámites seleccionados)'
    }
  }


  onCloseClicked() {
    sendEvent(this.eSignModalEvent, ESignModalEventType.CLOSE_BUTTON_CLICKED);
  }


  onToggleShowPasswordClicked() {
    this.showPassword = !this.showPassword;
  }


  onExecuteOperationClicked() {
    if (this.form.invalid || this.submitted) {
      this.form.markAllAsTouched();
      return;
    }

    const promise = this.validaOperationToExecute();

    if (!!promise) {
      this.executeOperation(promise);
    }
  }


  private validaOperationToExecute(): Promise<void> {
    switch (this.operation.uid as ESignOperationType) {
      case ESignOperationType.Sign:
        return this.eSignData.signMyTransactionDocuments(this.buildCommandToExecute());

      case ESignOperationType.Revoke:
        return this.eSignData.revokeMyTransactionDocuments(this.buildCommandToExecute());

      case ESignOperationType.Refuse:
        return this.eSignData.refuseMyTransactionDocuments(this.buildCommandToExecute());

      case ESignOperationType.Unrefuse:
        return this.eSignData.unrefuseMyTransactionDocuments(this.buildCommandToExecute());

      default:
        console.log(`Unhandled user interface operation ${this.operation.uid}`);
        return null;
    }
  }


  private buildCommandToExecute(): ESignCommand {
    Assertion.assertValue(this.operation.uid, 'operation');
    Assertion.assertValue(this.form.value.userID, 'userID');
    Assertion.assertValue(this.form.value.password, 'password');
    Assertion.assertValue(this.transactionList.length > 0, 'transactions');

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


  private executeOperation(promise: Promise<void>) {
    this.submitted = true;

    promise
      .then(x => sendEvent(this.eSignModalEvent, ESignModalEventType.OPERATION_EXECUTED))
      .catch(error => this.exceptionMsg = error.message)
      .finally(() => this.submitted = false);
  }

}
