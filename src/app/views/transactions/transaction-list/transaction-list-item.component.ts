/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { TransactionShortModel } from '@app/models';


@Component({
  selector: 'emp-land-transaction-list-item',
  templateUrl: './transaction-list-item.component.html',
})
export class TransactionListItemComponent {

  @Input() transaction: TransactionShortModel;

  @Output() optionsClick = new EventEmitter<boolean>();

  onClickTransactionOptions() {
    this.optionsClick.emit(true);
  }

}
