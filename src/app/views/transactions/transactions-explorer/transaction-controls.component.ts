/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EventInfo, Identifiable, isEmpty } from '@app/core';

import { expandCollapse } from '@app/shared/animations/animations';

import { sendEvent } from '@app/shared/utils';

import { TransactionShortModel, TransactionsOperationTypeList } from '@app/models';


export enum TransactionControlsEventType {
  EXECUTE_OPERATION_CLICKED = 'TransactionControlsComponent.Event.ExecuteOperationClicked',
}

@Component({
  selector: 'emp-land-transaction-controls',
  templateUrl: './transaction-controls.component.html',
  animations: [
    expandCollapse
  ],
})
export class TransactionControlsComponent {

  @Input() transactionsSelected: TransactionShortModel[] = []

  @Output() transactionControlsEvent = new EventEmitter<EventInfo>();

  operationSelected: Identifiable = null;

  operationsList: Identifiable[] = TransactionsOperationTypeList;

  constructor() { }


  get operationValid() {
    return isEmpty(this.operationSelected) ? false :true;
  }


  onExecuteOperationClicked() {
    if (this.operationValid) {
      this.emitExecuteOperationClicked();
    }
  }


  private emitExecuteOperationClicked() {
    const payload = {
      operation: this.operationSelected,
      transactions: this.transactionsSelected,
    };

    sendEvent(this.transactionControlsEvent, TransactionControlsEventType.EXECUTE_OPERATION_CLICKED,
      payload);
  }

}
