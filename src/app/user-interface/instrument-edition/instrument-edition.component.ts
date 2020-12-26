/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, OnChanges } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { isEmpty } from '@app/core';
import { PresentationLayer } from '@app/core/presentation';
import { InstrumentsStateSelector } from '@app/core/presentation/state.commands';

import { Transaction, EmptyTransaction, Instrument, EmptyInstrument } from '@app/domain/models';


@Component({
  selector: 'emp-land-instrument-edition',
  templateUrl: './instrument-edition.component.html',
})
export class InstrumentEditionComponent implements OnChanges {

  @Input() transaction: Transaction = EmptyTransaction;

  instrument: Instrument = EmptyInstrument;

  private unsubscribe: Subject<void> = new Subject();

  constructor(private uiLayer: PresentationLayer) { }

  ngOnChanges() {
    this.uiLayer.select<Instrument>(InstrumentsStateSelector.TRANSACTION_INSTRUMENT,
                                    this.transaction.uid)
    .pipe(takeUntil(this.unsubscribe))
    .subscribe(x => this.instrument = isEmpty(x) ? EmptyInstrument : x);
  }

}
