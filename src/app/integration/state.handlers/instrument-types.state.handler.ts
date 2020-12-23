/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion } from '@app/core';

import { AbstractStateHandler, StateValues } from '@app/core/presentation/state-handler';
import { InstrumentTypesApiProvider } from '@app/domain/providers';


export enum ActionType {
  LOAD_INSTRUMENT_KIND_LIST = 'Land.UI-Action.Instrument-types.LoadInstrumentKindList',
}


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
      selectors: SelectorType,
      actions: ActionType
    });
  }



  dispatch<U>(actionType: ActionType, payload?: any): Promise<U> | void {
    switch (actionType) {
      case ActionType.LOAD_INSTRUMENT_KIND_LIST:
        Assertion.assertValue(payload, 'instrumentType');

        return this.setValue<U>(SelectorType.INSTRUMENT_KIND_LIST,
                                this.service.getInstrumentKindsList(payload));

      default:
        throw this.unhandledCommandOrActionType(actionType);
    }
  }

}
