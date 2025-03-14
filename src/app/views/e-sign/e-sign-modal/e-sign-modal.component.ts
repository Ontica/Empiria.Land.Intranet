/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Assertion, Empty, EventInfo, Identifiable } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { ESignDataService } from '@app/data-services';

import { ESignCommand, ESignCredentials, ESignOperationType, LandEntity, LandExplorerTypes } from '@app/models';

import { ESignFormEventType } from './e-sign-form.component';

export enum ESignModalEventType {
  OPERATION_EXECUTED   = 'ESignModalComponent.Event.OperationExecuted',
  CLOSE_BUTTON_CLICKED = 'ESignModalComponent.Event.CloseButtonClicked',
}

@Component({
  selector: 'emp-land-e-sign-modal',
  templateUrl: './e-sign-modal.component.html',
})
export class ESignModalComponent implements OnInit {

  @Input() explorerType = LandExplorerTypes.ESIGN_TRANSACTION;

  @Input() operation: Identifiable = Empty;

  @Input() itemsList: LandEntity[] = [];

  @Output() eSignModalEvent = new EventEmitter<EventInfo>();

  title = '';

  submitted = false;

  exceptionMsg: string;


  constructor(private eSignData: ESignDataService) {

  }


  ngOnInit() {
    this.setTitleText();
  }


  onCloseClicked() {
    sendEvent(this.eSignModalEvent, ESignModalEventType.CLOSE_BUTTON_CLICKED);
  }


  onESignFormEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type as ESignFormEventType) {
      case ESignFormEventType.EXECUTE_OPERATION_BUTTON_CLICKED:
        Assertion.assertValue(event.payload.credentials, 'event.payload.credentials');
        Assertion.assertValue(event.payload.credentials.userID, 'event.payload.credentials.userID');
        Assertion.assertValue(event.payload.credentials.password, 'event.payload.credentials.password');

        const promise =
          this.validaOperationToExecuteByExplorerType(event.payload.credentials as ESignCredentials);

        if (!!promise) {
          this.executeOperation(promise);
        }

        break;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private validaOperationToExecuteByExplorerType(credentials: ESignCredentials): Promise<void> {
    switch (this.explorerType) {
      case LandExplorerTypes.ESIGN_TRANSACTION:
        return this.validaTransactionOperationToExecute(credentials);
      case LandExplorerTypes.ESIGN_DOCUMENT:
      default:
        return null;
    }
  }


  private validaTransactionOperationToExecute(credentials: ESignCredentials): Promise<void> {
    const command = this.buildCommandToExecute(credentials);

    switch (this.operation.uid as ESignOperationType) {
      case ESignOperationType.Sign: return this.eSignData.signMyTransactionDocuments(command);
      case ESignOperationType.Revoke: return this.eSignData.revokeMyTransactionDocuments(command);
      case ESignOperationType.Refuse: return this.eSignData.refuseMyTransactionDocuments(command);
      case ESignOperationType.Unrefuse: return this.eSignData.unrefuseMyTransactionDocuments(command);
      default:
        console.log(`Unhandled user interface operation ${this.operation.uid}`);
        return null;
    }
  }


  private buildCommandToExecute(credentials: ESignCredentials): ESignCommand {
    Assertion.assertValue(this.operation.uid, 'operation');
    Assertion.assertValue(this.itemsList.length > 0, 'transactions');
    Assertion.assertValue(credentials, 'credentials');

    const command: ESignCommand = {
      commandType: this.operation.uid as ESignOperationType,
      transactionUIDs: this.itemsList.map(x => x.uid),
      credentials,
    };

    return command;
  }


  private executeOperation(promise: Promise<void>) {
    this.submitted = true;

    promise
      .then(() => sendEvent(this.eSignModalEvent, ESignModalEventType.OPERATION_EXECUTED))
      .catch(error => this.exceptionMsg = error.error.message)
      .finally(() => this.submitted = false);
  }


  private setTitleText() {
    const itemTypeText = this.explorerType === LandExplorerTypes.ESIGN_TRANSACTION ? 'trámite' : 'documento';
    const itemCountText = this.itemsList.length;
    const itemsSelectionText = this.itemsList.length === 1 ? itemTypeText + ' seleccionado' : itemTypeText + 's seleccionados';
    this.title = `${this.operation.name} (${itemCountText} ${itemsSelectionText})`;
  }

}
