/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';

import { DateStringLibrary, isEmpty } from '@app/core';

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


  private setCardHint() {
    let cardText = `<strong>${this.transaction.transactionID}</strong>`;

    if (!!this.transaction.internalControlNo) {
      cardText += ` &nbsp; &nbsp; | &nbsp; &nbsp; <strong>${this.transaction.internalControlNo}</strong> &nbsp; &nbsp;`;
    }

    if (!isEmpty(this.transaction.subtype)) {
      cardText += ` &nbsp; &nbsp; | &nbsp; &nbsp; ${this.transaction.subtype.name}`;
    }

    if (!!this.transaction.presentationTime) {
      const presentationTime = DateStringLibrary.format(this.transaction.presentationTime);
      cardText += ` &nbsp; &nbsp; | &nbsp; &nbsp; Presentado el: ${presentationTime}`;
    }

    if (!!this.transaction.registrationTime) {
      const registrationTime = DateStringLibrary.format(this.transaction.registrationTime, 'DMY HH:mm');
      cardText += ` &nbsp; &nbsp; | &nbsp; &nbsp; Registrado el: ${registrationTime}`;
    }

    this.cardHint = cardText;
  }

}
