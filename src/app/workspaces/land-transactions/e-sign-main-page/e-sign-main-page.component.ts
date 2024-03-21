/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, OnInit } from '@angular/core';

import { EventInfo, isEmpty } from '@app/core';

import { ESignDataService } from '@app/data-services/e-sign.data.service';

import { ESignRequestsQuery, ESignOperationsList, EmptyESignRequestsQuery, ESignStatus,
         EmptyTransaction, Transaction, TransactionDescriptor, LandExplorerTypes,
         ESignStatusList } from '@app/models';

import { LandExplorerEventType } from '@app/views/land-list/land-explorer/land-explorer.component';

@Component({
  selector: 'emp-land-e-sign-main-page',
  templateUrl: './e-sign-main-page.component.html',
})
export class ESignMainPageComponent implements OnInit {

  eSignStatusList = ESignStatusList;

  eSignOperationList = ESignOperationsList;

  query: ESignRequestsQuery = EmptyESignRequestsQuery;

  transactionList: TransactionDescriptor[] = [];

  selectedTransaction: Transaction = EmptyTransaction;

  isLoading = false;

  landExplorerTypes = LandExplorerTypes;


  constructor(private eSignData: ESignDataService) {

  }


  ngOnInit() {
    this.searchESignRequestedTransactions();
  }


  get titleWithStatus() {
    const status = this.eSignStatusList.find(x => x.uid === this.query.status);
    if (isEmpty(status)) {
      return 'Firma electrónica';
    } else {
      return `Firma electrónica - ${status.name}`;
    }
  }


  onESignExplorerEvent(event: EventInfo): void {
    switch (event.type as LandExplorerEventType) {

      // case LandExplorerEventType.CREATE_ITEM_CLICKED:
      //   this.displayOptionModalSelected = 'CreateTransactionEditor';
      //   return;

      // case LandExplorerEventType.RECEIVE_ITEMS_CLICKED:
      //   this.displayOptionModalSelected = 'ReceiveTransactions';
      //   return;

      case LandExplorerEventType.FILTER_CHANGED:
        this.setESignQuery(event.payload.status ?? ESignStatus.Unsigned, event.payload.keywords ?? '');
        this.searchESignRequestedTransactions();
        return;

      // case LandExplorerEventType.ITEM_SELECTED:
      //   this.isLoadingTransaction = true;
      //   this.uiLayer.dispatch(TransactionAction.SELECT_TRANSACTION,
      //     { transactionUID: event.payload.item.uid });
      //   return;

      // case LandExplorerEventType.ITEM_EXECUTE_OPERATION:
      //   this.displayOptionModalSelected = 'ExecuteCommand';
      //   this.selectedTransactions = [event.payload.item];
      //   return;

      // case LandExplorerEventType.ITEMS_EXECUTE_OPERATION:
      //   this.displayOptionModalSelected = 'ExecuteCommandMultiple';
      //   this.selectedTransactions = event.payload.items;
      //   return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private searchESignRequestedTransactions() {
    this.isLoading = true;

    this.eSignData.searchESignRequestedTransactions(this.query)
      .toPromise()
      .then(x => this.transactionList = x)
      .finally(() => this.isLoading = false)
  }


  private setESignQuery(status: ESignStatus, keywords: string) {
    this.query = { ...this.query, ...{ status, keywords }};
  }

}
