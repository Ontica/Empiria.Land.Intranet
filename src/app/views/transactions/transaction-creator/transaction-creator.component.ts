/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';

import { combineLatest } from 'rxjs';

import { Command, EventInfo, Identifiable } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { TransactionCommandType, TransactionStateSelector } from '@app/core/presentation/presentation-types';

import { Agency, Transaction, EmptyTransaction, TransactionType } from '@app/models';

import { TransactionHeaderEventType } from '../transaction-header/transaction-header.component';


@Component({
  selector: 'emp-land-transaction-creator',
  templateUrl: './transaction-creator.component.html',
})
export class TransactionCreatorComponent implements OnInit, OnDestroy {

  @Output() closeEvent = new EventEmitter<void>();

  transaction: Transaction = EmptyTransaction;

  transactionTypeList: TransactionType[] = [];

  agencyList: Agency[] = [];

  filingOfficeList: Identifiable[] = [];

  helper: SubscriptionHelper;

  submitted = false;

  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
  }

  ngOnInit() {
    this.loadDataLists();
  }

  ngOnDestroy() {
    this.helper.destroy();
  }

  onTransactionHeaderEvent(event: EventInfo): void {
    if (this.submitted) {
      return;
    }

    switch (event.type as TransactionHeaderEventType) {

      case TransactionHeaderEventType.SAVE_TRANSACTION:

        const payload = {
          transactionUID: '',
          transaction: event.payload
        };

        this.executeCommand(TransactionCommandType.CREATE_TRANSACTION, payload)
          .then(x => this.onClose());

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }

  onClose() {
    this.closeEvent.emit();
  }

  private loadDataLists() {
    combineLatest([
      this.helper.select<TransactionType[]>(TransactionStateSelector.TRANSACTION_TYPE_LIST),
      this.helper.select<Identifiable[]>(TransactionStateSelector.FILING_OFFICE_LIST),
      this.helper.select<Agency[]>(TransactionStateSelector.AGENCY_LIST),
    ])
    .subscribe(([a, b, c]) => {
      this.transactionTypeList = a;
      this.filingOfficeList = b;
      this.agencyList = c;
    });
  }

  private executeCommand<T>(commandType: any, payload?: any): Promise<T> {

    this.submitted = true;

    const command: Command = {
      type: commandType,
      payload
    };

    return this.uiLayer.execute<T>(command)
      .finally(() => this.submitted = false);
  }

}
