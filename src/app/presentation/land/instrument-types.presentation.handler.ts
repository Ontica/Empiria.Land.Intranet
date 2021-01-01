/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Assertion, Cache } from '@app/core';

import { AbstractPresentationHandler, StateValues } from '@app/core/presentation/presentation.handler';

import { InstrumentTypeDataService } from '@app/data-services';

export enum SelectorType {
  INSTRUMENT_KIND_LIST = 'Land.UI-Item.Instrument-types.InstrumentKindList',
}

const initialState: StateValues = [
  { key: SelectorType.INSTRUMENT_KIND_LIST, value: new Cache<string[]>() },
];


@Injectable()
export class InstrumentTypesPresentationHandler extends AbstractPresentationHandler {

  constructor(private data: InstrumentTypeDataService) {
    super({
      initialState,
      selectors: SelectorType
    });
  }


  select<U>(selectorType: SelectorType, params?: any): Observable<U> {
    switch (selectorType) {

      case SelectorType.INSTRUMENT_KIND_LIST:
        Assertion.assertValue(params, 'params');

        const instrumentType = params;

        const dataProvider = () => this.data.getInstrumentKindsList(instrumentType);

        return super.selectMemoized<U>(selectorType, dataProvider, instrumentType);

      default:
        return super.select<U>(selectorType, params);

    }
  }

}
