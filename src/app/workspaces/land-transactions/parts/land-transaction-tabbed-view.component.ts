/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';

import { DateStringLibrary } from '@app/core';

import { Transaction, EmptyTransaction } from '@app/models';


@Component({
  selector: 'emp-land-transaction-tabbed-view',
  templateUrl: './land-transaction-tabbed-view.component.html'
})
export class LandTransactionTabbedViewComponent implements OnChanges {

  @Input() transaction: Transaction = EmptyTransaction;

  @Output() closeEvent = new EventEmitter<void>();

  cardHint = '';

  selectedTabIndex = 0;

  ngOnChanges() {
    this.setCardHint();
  }

  onClose() {
    this.closeEvent.emit();
  }


  private setSelectedTabIndex() {
    this.selectedTabIndex = 0;
  }


  private setCardHint() {
    this.cardHint = `<strong>${this.transaction.transactionID}</strong>`;

    if (this.transaction.internalControlNo) {
      const presentationTime = DateStringLibrary.format(this.transaction.presentationTime);

      this.cardHint += ` &nbsp; &nbsp; | &nbsp; &nbsp; <strong> ${this.transaction.internalControlNo} </strong> &nbsp; &nbsp;` +
        ` | ${this.transaction.subtype.name}` +
        ` | Presentado el: ${presentationTime}`;
    }
  }

}
