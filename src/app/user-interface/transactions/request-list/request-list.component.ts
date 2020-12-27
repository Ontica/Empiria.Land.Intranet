/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

import { EventInfo } from '@app/core';

import { PresentationState } from '@app/core/presentation';

import { Transaction, EmptyTransaction,
         TransactionFilter, EmptyTransactionFilter } from '@app/models';

import { TransactionAction, DocumentsRecordingAction } from '@app/core/presentation/state.commands';


export enum RequestListEventType {
  SET_FILTER                     = 'RequestListComponent.SetFilter',
  ON_CLICK_CREATE_REQUEST_BUTTON = 'RequestListComponent.OnClickCreateRequestButton'
}


@Component({
  selector: 'emp-land-request-list',
  templateUrl: './request-list.component.html'
})
export class RequestListComponent implements OnChanges {

  @Input() requestList: Transaction[] = [];

  @Input() selectedRequest: Transaction = EmptyTransaction;

  @Input() filter: TransactionFilter = EmptyTransactionFilter;

  @Input() title = 'Trámites';

  @Input() isLoading = false;

  @Output() requestListEvent = new EventEmitter<EventInfo>();

  keywords = '';


  constructor(private store: PresentationState) { }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.filter) {
      this.keywords = this.filter.keywords;
    }
  }


  isSelected(request: Transaction) {
    return (this.selectedRequest.uid === request.uid);
  }


  onFilterChange() {
    this.setFilter();
  }


  onSelect(request: Transaction) {
    this.store.dispatch(TransactionAction.SELECT_TRANSACTION, { request });
  }

  onSelectRecordingAct(request: Transaction) {
    this.store.dispatch(DocumentsRecordingAction.SELECT_RECORDING_ACT, { request });
  }

  onClickCreateRequestButton() {
    // const event: EventInfo = {
    //   type: RequestListEventType.ON_CLICK_CREATE_REQUEST_BUTTON
    // };

    // this.requestListEvent.emit(event);
  }


  // private methods


  private setFilter() {
    const event: EventInfo = {
      type: RequestListEventType.SET_FILTER,
      payload: { keywords: this.keywords }
    };

    this.requestListEvent.emit(event);
  }

}
