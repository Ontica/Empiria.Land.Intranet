/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { PresentationState } from '@app/core/presentation';
import { TransactionStateSelector, MainUIStateSelector,
         DocumentsRecordingAction, DocumentsRecordingStateSelector, TransactionAction } from '@app/core/presentation/state.commands';

import { Transaction, TransactionFilter, TransactionStagesType,
         EmptyTransaction, EmptyTransactionFilter, TransactionStatusType } from '@app/domain/models';

import { View } from '@app/user-interface/main-layout';

import { RequestListEventType } from '../request-list/request-list.component';


@Component({
  selector: 'emp-land-transactions-main-page',
  templateUrl: './transactions-main-page.component.html'
})
export class TransactionsMainPageComponent implements OnInit, OnDestroy {

  displayEditor = false;
  displayEditorRecordingAct = false;

  currentView: View;

  requestList: Transaction[] = [];
  selectedRequest: Transaction = EmptyTransaction;
  filter: TransactionFilter = EmptyTransactionFilter;

  displayRequestCreator = false;

  isLoading = false;

  private unsubscribe: Subject<void> = new Subject();

  constructor(private store: PresentationState) { }


  ngOnInit() {
    this.store.select<Transaction[]>(TransactionStateSelector.TRANSACTION_LIST)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(x => {
        this.requestList = x;
        this.isLoading = false;
      });

    this.store.select<View>(MainUIStateSelector.CURRENT_VIEW)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(x =>{
        this.onChangeView(x);
        this.store.dispatch(TransactionAction.UNSELECT_TRANSACTION);
        this.store.dispatch(DocumentsRecordingAction.UNSELECT_RECORDING_ACT);
      }
      );

    this.store.select<Transaction>(TransactionStateSelector.SELECTED_TRANSACTION)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(x => {
        this.selectedRequest = x;
        this.displayEditor = !isEmpty(this.selectedRequest);
      });

    this.store.select<TransactionFilter>(TransactionStateSelector.LIST_FILTER)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(x =>
        this.filter = x
      );

    this.store.select<Transaction>(DocumentsRecordingStateSelector.SELECTED_RECORDING_ACT)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(x => {
        this.selectedRequest = x;
        this.displayEditorRecordingAct = !isEmpty(this.selectedRequest);
      });
  }


  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }


  onCloseEditor() {
    this.store.dispatch(TransactionAction.UNSELECT_TRANSACTION);
    this.store.dispatch(DocumentsRecordingAction.UNSELECT_RECORDING_ACT);
  }


  onRequestCreatorClosed() {
    this.displayRequestCreator = false;
  }


  onRequestListEvent(event: EventInfo): void {
    switch (event.type as RequestListEventType) {

      case RequestListEventType.SET_FILTER:
        this.loadRequests(event.payload);
        return;

      case RequestListEventType.ON_CLICK_CREATE_REQUEST_BUTTON:
        this.displayRequestCreator = true;
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  // private methods


  private onChangeView(newView: View) {
    this.currentView = newView;
    this.loadRequests();
  }


  private getRequestStageForView(view: View): TransactionStagesType {
    switch (view.name) {
      case 'Requests.Pending': // En Elaboracion
        return 'InProgress';
      case 'Requests.OnSign': // En Firma
        return null; // 'InProgress'
      case 'Requests.Finished': // Finalizados
        return 'Completed';
      case 'Requests.Rejected': // Devueltos
        return 'Returned';
      case 'Requests.OnPayment': // Por Ingresar
        return 'Pending';
      case 'Requests.All': // Todos
        return 'All';
      default:
        throw Assertion.assertNoReachThisCode(`Unrecognized view with name '${view.name}'.`);
    }
  }

  private getRequestStatusForView(view: View): TransactionStatusType {
    if (view.name === 'Requests.OnSign'){
      return 'OnSign';
    }else{
      return null;
    }
  }

  private loadRequests(data?: { keywords: string }) {
    const currentKeywords =
    this.store.getValue<TransactionFilter>(TransactionStateSelector.LIST_FILTER).keywords;
    const filter: TransactionFilter = {
      stage: this.getRequestStageForView(this.currentView),
      status: this.getRequestStatusForView(this.currentView),
      keywords: data ? data.keywords : currentKeywords,
    };
    this.isLoading = true;
    this.store.dispatch(TransactionAction.LOAD_TRANSACTION_LIST, { filter });
  }

}
