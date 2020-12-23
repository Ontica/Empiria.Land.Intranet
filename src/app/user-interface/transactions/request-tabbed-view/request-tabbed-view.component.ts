/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { FrontController, PresentationState } from '@app/core/presentation';
import { InstrumentsAction } from '@app/core/presentation/state.commands';

import { Transaction, EmptyTransaction } from '@app/domain/models';


@Component({
  selector: 'emp-land-request-tabbed-view',
  templateUrl: './request-tabbed-view.component.html'
})
export class RequestTabbedViewComponent implements OnInit, OnChanges {

  @Input() request: Transaction = EmptyTransaction;

  @Output() closeEvent = new EventEmitter<void>();

  selectedTabIndex = 0;

  constructor(private frontController: FrontController, private store: PresentationState) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setSelectedTabIndex();

    if (changes.request && changes.request.currentValue){
      console.log('Transaction ui:', this.request.uid);
      this.store.dispatch(InstrumentsAction.LOAD_TRANSACTION_INSTRUMENT, this.request.uid);
    }
  }


  onClose() {
    this.closeEvent.emit();
  }


  private setSelectedTabIndex() {
    this.selectedTabIndex = 2;
  }

}
