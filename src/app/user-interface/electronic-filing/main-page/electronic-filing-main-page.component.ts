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
import { ElectronicFilingStateSelector, ElectronicFilingAction,
         MainUIStateSelector } from '@app/core/presentation/state.commands';

import { EFilingRequest, EmptyEFilingRequest, FilingRequestStatusType,
         EFilingRequestFilter, EmptyEFilingRequestFilter } from '@app/domain/models';

import { View } from '@app/user-interface/main-layout';

import { RequestListEventType } from '../request-list/request-list.component';


@Component({
  selector: 'emp-one-electronic-filing-main-page',
  templateUrl: './electronic-filing-main-page.component.html'
})
export class ElectronicFilingMainPageComponent implements OnInit, OnDestroy {

  displayEditor = false;
  currentView: View;

  requestList: EFilingRequest[] = [];
  selectedRequest: EFilingRequest = EmptyEFilingRequest;
  filter: EFilingRequestFilter = EmptyEFilingRequestFilter;

  displayRequestCreator = false;

  isLoading = false;

  private unsubscribe: Subject<void> = new Subject();

  constructor(private store: PresentationState) { }


  ngOnInit() {
    this.store.select<EFilingRequest[]>(ElectronicFilingStateSelector.REQUESTS_LIST)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(x => {
        this.requestList = x;
        this.isLoading = false;
      });

    this.store.select<View>(MainUIStateSelector.CURRENT_VIEW)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(x =>
        this.onChangeView(x)
      );

    this.store.select<EFilingRequest>(ElectronicFilingStateSelector.SELECTED_REQUEST)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(x => {
        this.selectedRequest = x;
        this.displayEditor = !isEmpty(this.selectedRequest);
      });

    this.store.select<EFilingRequestFilter>(ElectronicFilingStateSelector.LIST_FILTER)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(x =>
        this.filter = x
      );
  }


  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }


  onCloseEditor() {
    this.store.dispatch(ElectronicFilingAction.UNSELECT_REQUEST);
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


  private getRequestStatusForView(view: View): FilingRequestStatusType {
    switch (view.name) {
      case 'Requests.Pending':
        return 'Pending';
      case 'Requests.OnSign':
        return 'OnSign';
      case 'Requests.OnPayment':
        return 'OnPayment';
      case 'Requests.Submitted':
        return 'Submitted';
      case 'Requests.Finished':
        return 'Finished';
      case 'Requests.Rejected':
        return 'Rejected';
      case 'Requests.All':
        return 'All';
      default:
        throw Assertion.assertNoReachThisCode(`Unrecognized view with name '${view.name}'.`);
    }
  }


  private loadRequests(data?: { keywords: string }) {
    const currentKeywords =
                this.store.getValue<EFilingRequestFilter>(ElectronicFilingStateSelector.LIST_FILTER).keywords;

    const filter = {
      status: this.getRequestStatusForView(this.currentView),
      keywords: data ? data.keywords : currentKeywords
    };

    this.isLoading = true;
    this.store.dispatch(ElectronicFilingAction.LOAD_REQUESTS_LIST, { filter });
  }

}
