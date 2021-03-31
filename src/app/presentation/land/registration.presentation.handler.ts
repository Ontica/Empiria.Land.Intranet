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

import { EmptyBookEntry, EmptyInstrumentRecording, EmptyRecordingAct, EmptyRecordingBook } from '@app/models';

import { RecordingDataService } from '@app/data-services';


export enum ActionType {
  SELECT_RECORDING_ACT =    'Land.Registration.Action.SelectRecordingAct',
  UNSELECT_RECORDING_ACT =  'Land.Registration.Action.UnselectRecordingAct',
  SELECT_RECORDING_BOOK =   'Land.Registration.Action.SelectRecordingBook',
  UNSELECT_RECORDING_BOOK = 'Land.Registration.Action.UnselectRecordingBook',
  SELECT_BOOK_ENTRY =       'Land.Registration.Action.SelectBookEntry',
  UNSELECT_BOOK_ENTRY =     'Land.Registration.Action.UnselectBookEntry',
}


export enum SelectorType {
  TRANSACTION_INSTRUMENT_RECORDING = 'Land.Registration.Selector.TransactionInstrumentRecording',
  SELECTED_RECORDING_ACT           = 'Land.Registration.Selector.SelectedRecordingAct',
  SELECTED_RECORDING_BOOK          = 'Land.Registration.Selector.SelectedRecordingBook',
  SELECTED_BOOK_ENTRY              = 'Land.Registration.Selector.SelectedBookEntry',
}


export enum CommandType {
  CREATE_INSTRUMENT_RECORDING = 'Land.Registration.Create.Instrument',
  UPDATE_RECORDED_INSTRUMENT  = 'Land.Registration.Update.Instrument',
  CREATE_RECORDING_ACT        = 'Land.Registration.Create.RecordingAct',
  DELETE_RECORDING_ACT        = 'Land.Registration.Delete.RecordingAct',
  CREATE_INSTRUMENT_RECORDING_BOOK_ENTRY = 'Land.Registration.Create.InstrumentRecordingBookEntry',
  DELETE_INSTRUMENT_RECORDING_BOOK_ENTRY = 'Land.Registration.Delete.InstrumentRecordingBookEntry',
}


export enum EffectType {
  CREATE_INSTRUMENT_RECORDING = CommandType.CREATE_INSTRUMENT_RECORDING,
  UPDATE_RECORDED_INSTRUMENT  = CommandType.UPDATE_RECORDED_INSTRUMENT,

  CREATE_RECORDING_ACT        = CommandType.CREATE_RECORDING_ACT,
  DELETE_RECORDING_ACT        = CommandType.DELETE_RECORDING_ACT,

  CREATE_INSTRUMENT_RECORDING_BOOK_ENTRY = CommandType.CREATE_INSTRUMENT_RECORDING_BOOK_ENTRY,
  DELETE_INSTRUMENT_RECORDING_BOOK_ENTRY = CommandType.DELETE_INSTRUMENT_RECORDING_BOOK_ENTRY,
}


const initialState: StateValues = [
  { key: SelectorType.TRANSACTION_INSTRUMENT_RECORDING, value: EmptyInstrumentRecording },
  { key: SelectorType.SELECTED_RECORDING_ACT, value: EmptyRecordingAct },
  { key: SelectorType.SELECTED_RECORDING_BOOK, value: EmptyRecordingBook },
  { key: SelectorType.SELECTED_BOOK_ENTRY, value: EmptyBookEntry },
];


@Injectable()
export class RegistrationPresentationHandler extends AbstractPresentationHandler {

  constructor(private data: RecordingDataService) {
    super({
      initialState,
      selectors: SelectorType,
      commands: CommandType,
      effects: EffectType,
      actions: ActionType
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
      case EffectType.CREATE_RECORDING_ACT:
      case EffectType.DELETE_RECORDING_ACT:
      case EffectType.CREATE_INSTRUMENT_RECORDING_BOOK_ENTRY:
      case EffectType.DELETE_INSTRUMENT_RECORDING_BOOK_ENTRY:
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

      case CommandType.CREATE_RECORDING_ACT:
        return toPromise<U>(
          this.data.createRecordingAct(command.payload.instrumentRecordingUID,
                                       command.payload.registrationCommand)
        );

      case CommandType.DELETE_RECORDING_ACT:
        return toPromise<U>(
          this.data.deleteRecordingAct(command.payload.instrumentRecordingUID,
                                       command.payload.recordingActUID)
        );

      case CommandType.CREATE_INSTRUMENT_RECORDING_BOOK_ENTRY:
        return toPromise<U>(
          this.data.createNextRecordingBookEntry(command.payload.instrumentRecordingUID,
                                                 command.payload.bookEntryFields)
        );

      case CommandType.DELETE_INSTRUMENT_RECORDING_BOOK_ENTRY:
        return toPromise<U>(
          this.data.deleteRecordingBookEntry(command.payload.instrumentRecordingUID,
                                             command.payload.bookEntryUID)
        );

      default:
        throw this.unhandledCommand(command);
    }
  }


  dispatch(actionType: ActionType, params?: any): void {
    switch (actionType) {

      case ActionType.SELECT_RECORDING_ACT:
        Assertion.assertValue(params.recordingAct, 'payload.recordingAct');
        this.setValue(SelectorType.SELECTED_RECORDING_ACT, params.recordingAct);
        return;

      case ActionType.UNSELECT_RECORDING_ACT:
        this.setValue(SelectorType.SELECTED_RECORDING_ACT, EmptyRecordingAct);
        return;

      case ActionType.SELECT_RECORDING_BOOK:
        Assertion.assertValue(params.recordingBook, 'payload.recordingBook');
        this.setValue(SelectorType.SELECTED_RECORDING_BOOK, params.recordingBook);
        return;

      case ActionType.UNSELECT_RECORDING_BOOK:
        this.setValue(SelectorType.SELECTED_RECORDING_BOOK, EmptyRecordingBook);
        return;

      // TODO: move to select and define the WS to call
      case ActionType.SELECT_BOOK_ENTRY:
        Assertion.assertValue(params.bookEntry, 'payload.bookEntry');
        this.setValue(SelectorType.SELECTED_BOOK_ENTRY, params.bookEntry);
        return;

      case ActionType.UNSELECT_BOOK_ENTRY:
        this.setValue(SelectorType.SELECTED_BOOK_ENTRY, EmptyBookEntry);
        return;

      default:
        throw this.unhandledCommandOrActionType(actionType);
    }
  }

}
