/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Assertion, CommandResult } from '@app/core';

import { AbstractStateHandler, StateValues } from '@app/core/presentation/state-handler';

import { EmptyInstrument, IssuersFilter } from '@app/domain/models';

import { InstrumentsApiProvider } from '@app/domain/providers';

import { InstrumentsCommandType } from '../command.handlers/commands';


export enum SelectorType {
  TRANSACTION_INSTRUMENT = 'Land.Instruments.CurrentTransactionInstrument',
  ISSUER_LIST = 'Land.Instruments.InstrumentIssuers.List'
}


enum CommandEffectType {
  CREATE_INSTRUMENT = InstrumentsCommandType.CREATE_INSTRUMENT,
  UPDATE_INSTRUMENT = InstrumentsCommandType.UPDATE_INSTRUMENT,
}


const initialState: StateValues = [
  { key: SelectorType.TRANSACTION_INSTRUMENT, value: EmptyInstrument },
  { key: SelectorType.ISSUER_LIST, value: [] },
];


@Injectable()
export class InstrumentsStateHandler extends AbstractStateHandler {


  constructor(private service: InstrumentsApiProvider) {
    super({
      initialState,
      selectors: SelectorType,
      effects: CommandEffectType
    });
  }


  select<U>(selectorType: SelectorType, params?: any): Observable<U> {
    switch (selectorType) {

      case SelectorType.TRANSACTION_INSTRUMENT:
        Assertion.assertValue(params, 'params');

        const result = this.service.getTransactionInstrument(params);

        return result as unknown as Observable<U>;

      case SelectorType.ISSUER_LIST:
        Assertion.assertValue(params.instrumentType, 'params.InstrumentType');

        return this.service.findIssuers(params as IssuersFilter) as unknown as Observable<U>;
      default:
        return super.select<U>(selectorType, params);

    }
  }  // select


  applyEffects(command: CommandResult): void {
    switch ((command.type as any) as CommandEffectType) {

      case CommandEffectType.CREATE_INSTRUMENT:
      case CommandEffectType.UPDATE_INSTRUMENT:
        this.setValue(SelectorType.TRANSACTION_INSTRUMENT, command.result);
        return;

      default:
        throw this.unhandledCommandOrActionType(command);
    }
  }

}
