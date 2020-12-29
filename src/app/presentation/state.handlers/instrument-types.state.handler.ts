/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Assertion, toObservable } from '@app/core';

import { AbstractStateHandler, StateValues } from '@app/core/presentation/state-handler';

import { InstrumentTypeDataService } from '@app/data-services';

export enum SelectorType {
  INSTRUMENT_KIND_LIST = 'Land.UI-Item.Instrument-types.InstrumentKindList',
}

const initialState: StateValues = [
  { key: SelectorType.INSTRUMENT_KIND_LIST, value: [] },
];


@Injectable()
export class InstrumentTypesStateHandler extends AbstractStateHandler {

  constructor(private data: InstrumentTypeDataService) {
    super({
      initialState,
      selectors: SelectorType
    });
  }


  select<T>(selectorType: SelectorType, params?: any): Observable<T> {
    switch (selectorType) {

      case SelectorType.INSTRUMENT_KIND_LIST:
        Assertion.assertValue(params, 'params');

        return toObservable<T>(this.data.getInstrumentKindsList(params));

        // const dataProvider = () => this.data.getInstrumentKindsList(params);

        // return super.selectMemoized<T>(selectorType, dataProvider, params);

      default:
        return super.select<T>(selectorType, params);

    }
  }

}
