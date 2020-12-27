/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { Transaction } from '@app/models';


@Component({
  selector: 'emp-land-request-list-item',
  templateUrl: './request-list-item.component.html',
})
export class RequestListItemComponent {

  @Input() request: Transaction;
  @Output() editionEvent = new EventEmitter<boolean>();


  editRequest() {
    this.editionEvent.emit(true);
  }
}
