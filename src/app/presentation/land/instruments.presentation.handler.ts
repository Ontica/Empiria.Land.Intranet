/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Assertion, Cache, Command, toObservable, toPromise } from '@app/core';

import { AbstractPresentationHandler, StateValues } from '@app/core/presentation/presentation.handler';

import { Instrument, IssuersFilter } from '@app/models';

import { InstrumentDataService } from '@app/data-services';


export enum SelectorType {
  TRANSACTION_INSTRUMENT = 'Land.Instruments.CurrentTransactionInstrument',
  ISSUER_LIST = 'Land.Instruments.InstrumentIssuers.List'
}


export enum CommandType {
  CREATE_INSTRUMENT = 'Land.Transaction.Instrument.Create',
  UPDATE_INSTRUMENT = 'Land.Transaction.Instrument.Update',
  CREATE_PHYSICAL_RECORDING = 'Land.Transaction.Instrument.CreatePhysicalRecording',
  DELETE_PHYSICAL_RECORDING = 'Land.Transaction.Instrument.DeletePhysicalRecording',
}


export enum EffectType {
  CREATE_INSTRUMENT = CommandType.CREATE_INSTRUMENT,
  UPDATE_INSTRUMENT = CommandType.UPDATE_INSTRUMENT,
  CREATE_PHYSICAL_RECORDING = CommandType.CREATE_PHYSICAL_RECORDING,
  DELETE_PHYSICAL_RECORDING = CommandType.DELETE_PHYSICAL_RECORDING,
}


const initialState: StateValues = [
  { key: SelectorType.TRANSACTION_INSTRUMENT, value: new Cache<Instrument[]>() },
  { key: SelectorType.ISSUER_LIST, value: [] },
];


@Injectable()
export class InstrumentsPresentationHandler extends AbstractPresentationHandler {

  constructor(private data: InstrumentDataService) {
    super({
      initialState,
      selectors: SelectorType,
      commands: CommandType,
      effects: EffectType
    });
  }


  select<U>(selectorType: SelectorType, params?: any): Observable<U> {
    switch (selectorType) {

      case SelectorType.TRANSACTION_INSTRUMENT:
        Assertion.assertValue(params, 'params');

        const transactionUID = params;

        const provider = () => this.data.getTransactionInstrument(transactionUID);

        return super.selectMemoized<U>(selectorType, provider, transactionUID, {});

      case SelectorType.ISSUER_LIST:
        Assertion.assertValue(params.instrumentType, 'params.instrumentType');

        return toObservable<U>(this.data.findIssuers(params as IssuersFilter));

      default:
        return super.select<U>(selectorType, params);

    }
  }


  applyEffects(effectType: EffectType, params?: any): void {
    switch (effectType) {

      case EffectType.CREATE_INSTRUMENT:
      case EffectType.UPDATE_INSTRUMENT:
      case EffectType.CREATE_PHYSICAL_RECORDING:
      case EffectType.DELETE_PHYSICAL_RECORDING:
        super.setMemoized(SelectorType.TRANSACTION_INSTRUMENT, params.result,
                          params.payload.transactionUID);
        return;

      default:
        throw this.unhandledCommandOrActionType(effectType);
    }
  }


  execute<U>(command: Command): Promise<U> {

    switch (command.type as CommandType) {

      case CommandType.CREATE_INSTRUMENT:
        return toPromise<U>(
          this.data.createTransactionInstrument(command.payload.transactionUID,
                                                command.payload.instrument)
        );

      case CommandType.UPDATE_INSTRUMENT:
        return toPromise<U>(
          this.data.updateTransactionInstrument(command.payload.transactionUID,
                                                command.payload.instrument)
        );

      case CommandType.CREATE_PHYSICAL_RECORDING:
        return toPromise<U>(
          this.data.createNextPhysicalRecording(command.payload.instrumentUID,
                                                command.payload.physicalRecording)
        );

      case CommandType.DELETE_PHYSICAL_RECORDING:
        return toPromise<U>(
          this.data.deletePhysicalRecording(command.payload.instrumentUID,
                                            command.payload.physicalRecordingUID)
        );

      default:
        throw this.unhandledCommand(command);
    }
  }

}
