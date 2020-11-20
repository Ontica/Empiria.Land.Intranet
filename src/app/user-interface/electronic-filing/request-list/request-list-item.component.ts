/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, OnChanges } from '@angular/core';

import { EFilingRequest, PreventiveNote } from '@app/domain/models';


@Component({
  selector: 'emp-one-request-list-item',
  templateUrl: './request-list-item.component.html',
})
export class RequestListItemComponent implements OnChanges {

  @Input() request: EFilingRequest;

  preventiveNoteDueDate = '';

  ngOnChanges() {
    this.calculateDueDate();
  }

  private calculateDueDate() {
    if (!this.request || !this.request.transaction || !this.request.transaction.presentationDate) {
      this.preventiveNoteDueDate = '';
      return;
    }

    const oneDay = 24 * 60 * 60 * 1000;

    const presentation = new Date(this.request.transaction.presentationDate).getTime();
    const now = new Date().getTime();
    const dueDate = (presentation + (30 * oneDay)) - now;

    if (dueDate < 0) {
      this.preventiveNoteDueDate = `Vencido`;
      return;
    }

    const diffDays = Math.round(dueDate / oneDay);

    this.preventiveNoteDueDate = `Vigencia: ${diffDays} días`;
  }

}
