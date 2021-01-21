/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, OnChanges, OnDestroy } from '@angular/core';

import { isEmpty } from '@app/core';
import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';
import { InstrumentsStateSelector } from '@app/core/presentation/presentation-types';

import { Instrument, EmptyInstrument } from '@app/models';


@Component({
  selector: 'emp-land-instrument-edition',
  templateUrl: './instrument-edition.component.html',
})
export class InstrumentEditionComponent implements OnChanges, OnDestroy {

  @Input() transactionUID: string = 'Empty';

  @Input() canEdit: boolean = false;

  instrument: Instrument = EmptyInstrument;

  helper: SubscriptionHelper;

  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
  }

  ngOnChanges() {
    this.helper.select<Instrument>(InstrumentsStateSelector.TRANSACTION_INSTRUMENT, this.transactionUID)
      .subscribe(x => this.instrument = isEmpty(x) ? EmptyInstrument : x);
  }

  ngOnDestroy() {
    this.helper.destroy();
  }

}
