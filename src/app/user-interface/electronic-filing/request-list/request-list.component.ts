/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

import { EventInfo } from '@app/core';

import { PresentationState } from '@app/core/presentation';

import { EFilingRequest, EmptyEFilingRequest,
         EFilingRequestFilter, EmptyEFilingRequestFilter } from '@app/domain/models';

import { ElectronicFilingAction, DocumentsRecordingAction } from '@app/core/presentation/state.commands';


export enum RequestListEventType {
  SET_FILTER                     = 'RequestListComponent.SetFilter',
  ON_CLICK_CREATE_REQUEST_BUTTON = 'RequestListComponent.OnClickCreateRequestButton'
}


@Component({
  selector: 'emp-one-request-list',
  templateUrl: './request-list.component.html'
})
export class RequestListComponent implements OnChanges {

  @Input() requestList: EFilingRequest[] = [];

  @Input() selectedRequest: EFilingRequest = EmptyEFilingRequest;

  @Input() filter: EFilingRequestFilter = EmptyEFilingRequestFilter;

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


  isSelected(request: EFilingRequest) {
    return (this.selectedRequest.uid === request.uid);
  }


  onFilterChange() {
    this.setFilter();
  }


  onSelect(request: EFilingRequest) {
    this.store.dispatch(ElectronicFilingAction.SELECT_REQUEST, { request });
  }


  onClickCreateRequestButton() {
    const event: EventInfo = {
      type: RequestListEventType.ON_CLICK_CREATE_REQUEST_BUTTON
    };

    this.requestListEvent.emit(event);
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
