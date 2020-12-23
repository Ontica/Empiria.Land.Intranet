/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, CommandResult } from '@app/core';

import { AbstractStateHandler, StateValues } from '@app/core/presentation/state-handler';

import { EmptyInstrument } from '@app/domain/models';
import { InstrumentsApiProvider } from '@app/domain/providers';



export enum ActionType {
  LOAD_TRANSACTION_INSTRUMENT = 'Land.UI-Action.Instruments.LoadTransactionInstrument'
}


export enum SelectorType {
  TRANSACTION_INSTRUMENT = 'Land.UI-Item.Instruments.TransactionInstrument',
}


enum CommandEffectType {

}


const initialState: StateValues = [
  { key: SelectorType.TRANSACTION_INSTRUMENT, value: EmptyInstrument }
];


@Injectable()
export class InstrumentsStateHandler extends AbstractStateHandler {


  constructor(private service: InstrumentsApiProvider) {
    super({
      initialState,
      selectors: SelectorType,
      actions: ActionType,
      effects: CommandEffectType
    });
  }


  applyEffects(command: CommandResult): void {

  }


  dispatch<U>(actionType: ActionType, payload?: any): Promise<U> | void {
    switch (actionType) {

      case ActionType.LOAD_TRANSACTION_INSTRUMENT:
        Assertion.assertValue(payload, 'payload');

        return this.setValue<U>(SelectorType.TRANSACTION_INSTRUMENT,
                                this.service.getTransactionInstrument(payload));

      default:
        throw this.unhandledCommandOrActionType(actionType);
    }
  }

}
