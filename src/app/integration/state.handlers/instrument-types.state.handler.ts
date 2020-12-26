/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Assertion } from '@app/core';

import { AbstractStateHandler, StateValues } from '@app/core/presentation/state-handler';

import { InstrumentTypesApiProvider } from '@app/domain/providers';

export enum SelectorType {
  INSTRUMENT_KIND_LIST = 'Land.UI-Item.Instrument-types.InstrumentKindList',
}

const initialState: StateValues = [
  { key: SelectorType.INSTRUMENT_KIND_LIST, value: [] },
];


@Injectable()
export class InstrumentTypesStateHandler extends AbstractStateHandler {

  constructor(private service: InstrumentTypesApiProvider) {
    super({
      initialState,
      selectors: SelectorType
    });
  }


  select<T>(selectorType: SelectorType, params?: any): Observable<T> {
    switch (selectorType) {

      case SelectorType.INSTRUMENT_KIND_LIST:
        Assertion.assertValue(params, 'params');

        const result = this.service.getInstrumentKindsList(params);

        return result as Observable<T>;

      default:
        return super.select<T>(selectorType, params);

    }
  }  // select

}
