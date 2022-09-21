/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Assertion, Command, toObservable, toPromise } from '@app/core';

import { AbstractPresentationHandler, StateValues } from '@app/core/presentation/presentation.handler';

import { EmptyBookEntry, EmptyInstrumentRecording, EmptyRecordingBook,
         InstrumentRecording, EmptyRegistryEntryData } from '@app/models';

import { RecordingDataService } from '@app/data-services';


export enum ActionType {
  SELECT_TRANSACTION_INSTRUMENT_RECORDING   =  'Land.Registration.Action.SelectTransactionInstrumentRecording',
  UNSELECT_TRANSACTION_INSTRUMENT_RECORDING = 'Land.Registration.Action.UnselectTransactionInstrumentRecording',
  SELECT_REGISTRY_ENTRY   = 'Land.Registration.Action.SelectRegistryEntry',
  UNSELECT_REGISTRY_ENTRY = 'Land.Registration.Action.UnselectRegistryEntry',
  SELECT_RECORDING_BOOK   = 'Land.Registration.Action.SelectRecordingBook',
  UNSELECT_RECORDING_BOOK = 'Land.Registration.Action.UnselectRecordingBook',
  SELECT_BOOK_ENTRY       = 'Land.Registration.Action.SelectBookEntry',
  UNSELECT_BOOK_ENTRY     = 'Land.Registration.Action.UnselectBookEntry',
}


export enum SelectorType {
  TRANSACTION_INSTRUMENT_RECORDING = 'Land.Registration.Selector.TransactionInstrumentRecording',
  SELECTED_REGISTRY_ENTRY          = 'Land.Registration.Selector.SelectedRegistryEntry',
  SELECTED_RECORDING_BOOK          = 'Land.Registration.Selector.SelectedRecordingBook',
  SELECTED_BOOK_ENTRY              = 'Land.Registration.Selector.SelectedBookEntry',
  INSTRUMENT_RECORDING             = 'Land.Registration.Selector.InstrumentRecording',
  RECORDING_ACT_TYPES_LIST_FOR_INSTRUMENT =
    'Land.RecordableSubjects.Selector.RecordingActTypesForInstrument.List',
  RECORDING_ACT_TYPES_LIST_FOR_RECORDABLE_SUBJECT =
    'Land.RecordableSubjects.Selector.RecordingActTypesForRecordableSubject.List',
}


export enum CommandType {
  CREATE_INSTRUMENT_RECORDING = 'Land.Registration.Create.Instrument',
  UPDATE_RECORDED_INSTRUMENT  = 'Land.Registration.Update.Instrument',
  APPEND_RECORDING_ACT        = 'Land.Registration.Append.RecordingAct',
  REMOVE_RECORDING_ACT        = 'Land.Registration.Remove.RecordingAct',
  UPDATE_RECORDABLE_SUBJECT   = 'Land.Registration.Update.RecordableSubject',
  CREATE_INSTRUMENT_RECORDING_BOOK_ENTRY = 'Land.Registration.Create.InstrumentRecordingBookEntry',
  DELETE_INSTRUMENT_RECORDING_BOOK_ENTRY = 'Land.Registration.Delete.InstrumentRecordingBookEntry',
  CLOSE_REGISTRATION = 'Land.Registration.CloseRegistration',
  OPEN_REGISTRATION  = 'Land.Registration.OpenRegistration',
}


export enum EffectType {
  CREATE_INSTRUMENT_RECORDING = CommandType.CREATE_INSTRUMENT_RECORDING,
  UPDATE_RECORDED_INSTRUMENT  = CommandType.UPDATE_RECORDED_INSTRUMENT,

  APPEND_RECORDING_ACT        = CommandType.APPEND_RECORDING_ACT,
  REMOVE_RECORDING_ACT        = CommandType.REMOVE_RECORDING_ACT,

  UPDATE_RECORDABLE_SUBJECT   = CommandType.UPDATE_RECORDABLE_SUBJECT,

  CREATE_INSTRUMENT_RECORDING_BOOK_ENTRY = CommandType.CREATE_INSTRUMENT_RECORDING_BOOK_ENTRY,
  DELETE_INSTRUMENT_RECORDING_BOOK_ENTRY = CommandType.DELETE_INSTRUMENT_RECORDING_BOOK_ENTRY,

  CLOSE_REGISTRATION = CommandType.CLOSE_REGISTRATION,
  OPEN_REGISTRATION  = CommandType.OPEN_REGISTRATION
}


const initialState: StateValues = [
  { key: SelectorType.TRANSACTION_INSTRUMENT_RECORDING, value: EmptyInstrumentRecording },
  { key: SelectorType.SELECTED_REGISTRY_ENTRY, value: EmptyRegistryEntryData },
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

      case SelectorType.RECORDING_ACT_TYPES_LIST_FOR_INSTRUMENT:
        Assertion.assertValue(params.instrumentUID, 'params.instrumentUID');

        return toObservable<U>(this.data.getRecordingActTypesForInstrument(params.instrumentUID));

      case SelectorType.RECORDING_ACT_TYPES_LIST_FOR_RECORDABLE_SUBJECT:
        Assertion.assertValue(params.recordableSubjectUID, 'params.recordableSubjectUID');

        return toObservable<U>(this.data.getRecordingActTypesForRecordableSubject(params.recordableSubjectUID));

      default:
        return super.select<U>(selectorType, params);

    }
  }


  applyEffects(effectType: EffectType, params?: any): void {
    switch (effectType) {

      case EffectType.CREATE_INSTRUMENT_RECORDING:
      case EffectType.UPDATE_RECORDED_INSTRUMENT:
      case EffectType.APPEND_RECORDING_ACT:
      case EffectType.REMOVE_RECORDING_ACT:
      case EffectType.CREATE_INSTRUMENT_RECORDING_BOOK_ENTRY:
      case EffectType.DELETE_INSTRUMENT_RECORDING_BOOK_ENTRY:
      case EffectType.CLOSE_REGISTRATION:
      case EffectType.OPEN_REGISTRATION:
        this.setValue(SelectorType.TRANSACTION_INSTRUMENT_RECORDING, params.result);
        return;

      case EffectType.UPDATE_RECORDABLE_SUBJECT:
        const instrumentRecordingUpdated = params.result;
        const instrumentRecordingSelected =
          this.getValue<InstrumentRecording>(SelectorType.TRANSACTION_INSTRUMENT_RECORDING);

        if (instrumentRecordingUpdated.uid === instrumentRecordingSelected.uid) {
          this.setValue(SelectorType.TRANSACTION_INSTRUMENT_RECORDING, instrumentRecordingUpdated);
        }

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

      case CommandType.APPEND_RECORDING_ACT:
        return toPromise<U>(
          this.data.appendRecordingAct(command.payload.instrumentRecordingUID,
                                       command.payload.registrationCommand)
        );

      case CommandType.REMOVE_RECORDING_ACT:
        return toPromise<U>(
          this.data.removeRecordingAct(command.payload.instrumentRecordingUID,
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

      case CommandType.UPDATE_RECORDABLE_SUBJECT:
        return toPromise<U>(
          this.data.updateRecordableSubject(command.payload.instrumentRecordingUID,
                                            command.payload.recordingActUID,
                                            command.payload.recordableSubjectFields)
        );

      case CommandType.CLOSE_REGISTRATION:
        return toPromise<U>(
          this.data.closeRegistration(command.payload.instrumentRecordingUID)
        );


      case CommandType.OPEN_REGISTRATION:
        return toPromise<U>(
          this.data.openRegistration(command.payload.instrumentRecordingUID)
        );

      default:
        throw this.unhandledCommand(command);
    }
  }


  dispatch(actionType: ActionType, params?: any): void {
    switch (actionType) {

      case ActionType.SELECT_TRANSACTION_INSTRUMENT_RECORDING:
        Assertion.assertValue(params.transactionInstrumentRecording, 'params.transactionInstrumentRecording');
        super.setValue(SelectorType.TRANSACTION_INSTRUMENT_RECORDING, params.transactionInstrumentRecording);
        return;

      case ActionType.UNSELECT_TRANSACTION_INSTRUMENT_RECORDING:
        this.setValue(SelectorType.TRANSACTION_INSTRUMENT_RECORDING, EmptyInstrumentRecording);
        return;

      case ActionType.SELECT_REGISTRY_ENTRY:
        Assertion.assertValue(params.instrumentRecordingUID, 'payload.instrumentRecordingUID');
        Assertion.assertValue(params.recordingActUID, 'payload.recordingActUID');
        this.setValue(SelectorType.SELECTED_REGISTRY_ENTRY, params);
        return;

      case ActionType.UNSELECT_REGISTRY_ENTRY:
        this.setValue(SelectorType.SELECTED_REGISTRY_ENTRY, EmptyRegistryEntryData);
        return;

      case ActionType.SELECT_RECORDING_BOOK:
        Assertion.assertValue(params.recordingBookUID, 'payload.recordingBookUID');
        this.setValue(SelectorType.SELECTED_RECORDING_BOOK,
                      this.data.getRecordingBook(params.recordingBookUID));

        return;

      case ActionType.UNSELECT_RECORDING_BOOK:
        this.setValue(SelectorType.SELECTED_RECORDING_BOOK, EmptyRecordingBook);
        return;

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
