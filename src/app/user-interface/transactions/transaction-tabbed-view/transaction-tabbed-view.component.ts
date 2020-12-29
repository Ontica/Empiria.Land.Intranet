/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';

import { Transaction, EmptyTransaction } from '@app/models';


@Component({
  selector: 'emp-land-transaction-tabbed-view',
  templateUrl: './transaction-tabbed-view.component.html'
})
export class TransactionTabbedViewComponent implements OnChanges {

  @Input() transaction: Transaction = EmptyTransaction;

  @Output() closeEvent = new EventEmitter<void>();

  selectedTabIndex = 0;

  ngOnChanges() {
    this.setSelectedTabIndex();
  }

  onClose() {
    this.closeEvent.emit();
  }

  private setSelectedTabIndex() {
    this.selectedTabIndex = 2;
  }

}
