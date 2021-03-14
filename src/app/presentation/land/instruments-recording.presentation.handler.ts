/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Assertion, Command, toPromise } from '@app/core';

import { AbstractPresentationHandler, StateValues } from '@app/core/presentation/presentation.handler';

import { EmptyInstrumentRecording } from '@app/models';

import { InstrumentRecordingDataService, RecordingBooksDataService } from '@app/data-services';


export enum SelectorType {
  TRANSACTION_INSTRUMENT_RECORDING = 'Land.Instruments.TransactionInstrumentRecording'
}


export enum CommandType {
  CREATE_INSTRUMENT_RECORDING = 'Land.InstrumentRecording.Create',
  UPDATE_RECORDED_INSTRUMENT  = 'Land.InstrumentRecording.Update',
  CREATE_RECORDING_BOOK_ENTRY = 'Land.InstrumentRecording.CreateRecordingBookEntry',
  DELETE_RECORDING_BOOK_ENTRY = 'Land.InstrumentRecording.DeleteRecordingBookEntry',
}


export enum EffectType {
  CREATE_INSTRUMENT_RECORDING = CommandType.CREATE_INSTRUMENT_RECORDING,
  UPDATE_RECORDED_INSTRUMENT  = CommandType.UPDATE_RECORDED_INSTRUMENT,
  CREATE_RECORDING_BOOK_ENTRY = CommandType.CREATE_RECORDING_BOOK_ENTRY,
  DELETE_RECORDING_BOOK_ENTRY = CommandType.DELETE_RECORDING_BOOK_ENTRY,
}


const initialState: StateValues = [
  { key: SelectorType.TRANSACTION_INSTRUMENT_RECORDING, value: EmptyInstrumentRecording },
];


@Injectable()
export class InstrumentsRecordingPresentationHandler extends AbstractPresentationHandler {

  constructor(private data: InstrumentRecordingDataService,
              private recordingBooksData: RecordingBooksDataService) {
    super({
      initialState,
      selectors: SelectorType,
      commands: CommandType,
      effects: EffectType
    });
  }


  select<U>(selectorType: SelectorType, params?: any): Observable<U> {
    switch (selectorType) {

      case SelectorType.TRANSACTION_INSTRUMENT_RECORDING:
        Assertion.assertValue(params, 'params');

        const transactionUID = params;

        const value = this.data.getTransactionInstrumentRecording(transactionUID);

        super.setValue(SelectorType.TRANSACTION_INSTRUMENT_RECORDING, value);

        return super.select<U>(selectorType);

      default:
        return super.select<U>(selectorType, params);

    }
  }


  applyEffects(effectType: EffectType, params?: any): void {
    switch (effectType) {

      case EffectType.CREATE_INSTRUMENT_RECORDING:
      case EffectType.UPDATE_RECORDED_INSTRUMENT:
      case EffectType.CREATE_RECORDING_BOOK_ENTRY:
      case EffectType.DELETE_RECORDING_BOOK_ENTRY:
        super.setValue(SelectorType.TRANSACTION_INSTRUMENT_RECORDING, params.result);
        return;

      default:
        throw this.unhandledCommandOrActionType(effectType);
    }
  }


  execute<U>(command: Command): Promise<U> {

    switch (command.type as CommandType) {

      case CommandType.CREATE_INSTRUMENT_RECORDING:
        return toPromise<U>(
          this.data.createTransactionInstrumentRecording(command.payload.transactionUID,
                                                         command.payload.instrument)
        );

      case CommandType.UPDATE_RECORDED_INSTRUMENT:
        return toPromise<U>(
          this.data.updateTransactionInstrumentRecording(command.payload.transactionUID,
                                                         command.payload.instrument)
        );

      case CommandType.CREATE_RECORDING_BOOK_ENTRY:
        return toPromise<U>(
          this.recordingBooksData.createNextBookEntry(command.payload.instrumentRecordingUID,
                                                      command.payload.bookEntryFields)
        );

      case CommandType.DELETE_RECORDING_BOOK_ENTRY:
        return toPromise<U>(
          this.recordingBooksData.deleteBookEntry(command.payload.instrumentRecordingUID,
                                                  command.payload.bookEntryUID)
        );

      default:
        throw this.unhandledCommand(command);
    }
  }

}
