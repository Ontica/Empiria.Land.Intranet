/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, OnInit } from '@angular/core';
import { EmptyTransaction, Transaction } from '@app/domain/models';


@Component({
  selector: 'emp-land-instrument-edition',
  templateUrl: './instrument-edition.component.html',
})
export class InstrumentEditionComponent implements OnInit {

  @Input() request: Transaction = EmptyTransaction;

  constructor() { }

  ngOnInit(): void {
  }

}
