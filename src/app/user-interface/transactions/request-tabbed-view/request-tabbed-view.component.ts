/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FrontController } from '@app/core/presentation';

import { Transaction, EmptyTransaction } from '@app/domain/models';


@Component({
  selector: 'emp-land-request-tabbed-view',
  templateUrl: './request-tabbed-view.component.html'
})
export class RequestTabbedViewComponent implements OnChanges {

  @Input() request: Transaction = EmptyTransaction;

  @Output() closeEvent = new EventEmitter<void>();

  selectedTabIndex = 0;

  constructor(private frontController: FrontController) { }


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
