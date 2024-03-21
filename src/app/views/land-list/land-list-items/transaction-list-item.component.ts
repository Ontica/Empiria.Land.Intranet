/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { TransactionDescriptor } from '@app/models';


@Component({
  selector: 'emp-land-transaction-list-item',
  templateUrl: './transaction-list-item.component.html',
})
export class TransactionListItemComponent {

  @Input() transaction: TransactionDescriptor;

  @Input() listOptions: any[] = [{name: 'Cambiar estado', value: 'SetNextStatus'}];

  @Output() optionsClick = new EventEmitter<boolean>();

  onClickTransactionOptions(option) {
    this.optionsClick.emit(option.value);
  }

}
