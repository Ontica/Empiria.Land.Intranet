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

import { TransactionDataService } from '@app/data-services';

import { ArrayLibrary } from '@app/shared/utils';

import { TransactionFilter, TransactionShortModel,
         EmptyTransaction, EmptyTransactionFilter,
         mapTransactionShortModelFromTransaction } from '@app/models';


export enum ActionType {
  SELECT_TRANSACTION = 'Land.Transactions.Action.SelectTransaction',
  SET_LIST_FILTER = 'Land.Transactions.Action.SetListFilter',
  UNSELECT_TRANSACTION = 'Land.Transactions.Action.UnselectTransaction'
}


export enum CommandType {
  CREATE_TRANSACTION = 'Land.Transactions.Command.CreateTransaction',
  UPDATE_TRANSACTION = 'Land.Transactions.Command.UpdateTransaction',
  CLONE_TRANSACTION = 'Land.Transactions.Command.CloneTransaction',
  DELETE_TRANSACTION = 'Land.Transactions.Command.DeleteTransaction',
  ADD_TRANSACTION_SERVICE = 'Land.Transactions.Command.AddTransactionService',
  DELETE_TRANSACTION_SERVICE = 'Land.Transactions.Command.DeleteTransactionService',
}


export enum EffectType {
  SET_LIST_FILTER = ActionType.SET_LIST_FILTER,
  CREATE_TRANSACTION = CommandType.CREATE_TRANSACTION,
  UPDATE_TRANSACTION = CommandType.UPDATE_TRANSACTION,
  CLONE_TRANSACTION = CommandType.CLONE_TRANSACTION,
  DELETE_TRANSACTION = CommandType.DELETE_TRANSACTION,
  ADD_TRANSACTION_SERVICE = CommandType.ADD_TRANSACTION_SERVICE,
  DELETE_TRANSACTION_SERVICE = CommandType.DELETE_TRANSACTION_SERVICE,
}


export enum SelectorType {
  LIST_FILTER = 'Land.Transactions.Selectors.TransactionListFilter',
  SELECTED_TRANSACTION = 'Land.Transactions.Selectors.SelectedTransaction',
  TRANSACTION_LIST = 'Land.Transactions.Selectors.TransactionList',
  TRANSACTION_TYPE_LIST = 'Land.Transactions.Selectors.TransactionTypeList',
  AGENCY_LIST = 'Land.Transactions.Selectors.AgencyList',
  PROVIDED_SERVICE_LIST = 'Land.Transactions.Selectors.ProvidedServiceList',
  RECORDER_OFFICE_LIST = 'Land.Transactions.Selectors.RecorderOfficeList',
}


const initialState: StateValues = [
  { key: SelectorType.LIST_FILTER, value: EmptyTransactionFilter },
  { key: SelectorType.SELECTED_TRANSACTION, value: EmptyTransaction },
  { key: SelectorType.TRANSACTION_LIST, value: [] },
  { key: SelectorType.TRANSACTION_TYPE_LIST, value: [] },
  { key: SelectorType.AGENCY_LIST, value: [] },
  { key: SelectorType.PROVIDED_SERVICE_LIST, value: [] },
  { key: SelectorType.RECORDER_OFFICE_LIST, value: [] },
];


@Injectable()
export class TransactionPresentationHandler extends AbstractPresentationHandler {

  constructor(private data: TransactionDataService) {
    super({
      initialState,
      selectors: SelectorType,
      effects: EffectType,
      commands: CommandType,
      actions: ActionType
    });
  }


  select<U>(selectorType: SelectorType, params?: any): Observable<U> {
    let provider: () => any;

    switch (selectorType) {

      case SelectorType.TRANSACTION_LIST:
        return super.select<U>(selectorType);

      case SelectorType.LIST_FILTER:
        return super.select<U>(selectorType);

      case SelectorType.TRANSACTION_TYPE_LIST:
        provider = () => this.data.getTransactionTypes();

        return super.selectFirst<U>(selectorType, provider);

      case SelectorType.AGENCY_LIST:
        provider = () => this.data.getAgencies();

        return super.selectFirst<U>(selectorType, provider);

      case SelectorType.PROVIDED_SERVICE_LIST:
        provider = () => this.data.getProvidedServices();

        return super.selectFirst<U>(selectorType, provider);

      case SelectorType.RECORDER_OFFICE_LIST:
        provider = () => this.data.getRecorderOffices();

        return super.selectFirst<U>(selectorType, provider);

      default:
        return super.select<U>(selectorType, params);

    }
  }


  applyEffects(effectType: EffectType, params?: any): void {

    let transactionList = null;

    switch (effectType) {

      case EffectType.CREATE_TRANSACTION:
      case EffectType.UPDATE_TRANSACTION:
      case EffectType.CLONE_TRANSACTION:
      case EffectType.ADD_TRANSACTION_SERVICE:
      case EffectType.DELETE_TRANSACTION_SERVICE:

        transactionList = this.getValue<TransactionShortModel[]>(SelectorType.TRANSACTION_LIST);

        const transactionToInsert = mapTransactionShortModelFromTransaction(params.result);

        const transactionListNew = ArrayLibrary.insertItemTop(transactionList, transactionToInsert, 'uid');

        this.setValue(SelectorType.TRANSACTION_LIST, transactionListNew);

        this.setValue(SelectorType.SELECTED_TRANSACTION, params.result);

        return;

      case EffectType.DELETE_TRANSACTION:

        transactionList = this.getValue<TransactionShortModel[]>(SelectorType.TRANSACTION_LIST);

        this.setValue(SelectorType.TRANSACTION_LIST,
                      transactionList.filter(x => x.uid !== params.payload.transactionUID));

        this.dispatch(ActionType.UNSELECT_TRANSACTION);

        return;

      case EffectType.SET_LIST_FILTER:

        const filter = this.getValue<TransactionFilter>(SelectorType.LIST_FILTER);

        transactionList = this.data.getTransactionList(filter);

        this.setValue(SelectorType.TRANSACTION_LIST, transactionList);

        this.dispatch(ActionType.UNSELECT_TRANSACTION);

        return;
      default:
        throw this.unhandledCommandOrActionType(effectType);
    }
  }


  execute<T>(command: Command): Promise<T> {

    switch (command.type as CommandType) {

      case CommandType.CREATE_TRANSACTION:
        return toPromise<T>(
          this.data.createTransaction(command.payload.transaction)
        );

      case CommandType.UPDATE_TRANSACTION:
        return toPromise<T>(
          this.data.updateTransaction(command.payload.transactionUID,
                                      command.payload.transaction)
        );

      case CommandType.CLONE_TRANSACTION:
        return toPromise<T>(
          this.data.cloneTransaction(command.payload.transactionUID)
        );

      case CommandType.DELETE_TRANSACTION:
        return toPromise<T>(
          this.data.deleteTransaction(command.payload.transactionUID)
        );

      case CommandType.ADD_TRANSACTION_SERVICE:
        return toPromise<T>(
          this.data.addTransactionService(command.payload.transactionUID,
                                          command.payload.requestedService)
        );

      case CommandType.DELETE_TRANSACTION_SERVICE:
        return toPromise<T>(
          this.data.deleteTransactionService(command.payload.transactionUID,
                                             command.payload.requestedServiceUID)
        );

      default:
        throw this.unhandledCommand(command);
    }
  }


  dispatch(actionType: ActionType, params?: any): void {
    switch (actionType) {

      case ActionType.SELECT_TRANSACTION:
        Assertion.assertValue(params.transactionUID, 'payload.transactionUID');

        const transaction = this.data.getTransaction(params.transactionUID);

        this.setValue(SelectorType.SELECTED_TRANSACTION, transaction);

        return;

      case ActionType.UNSELECT_TRANSACTION:
        this.setValue(SelectorType.SELECTED_TRANSACTION, EmptyTransaction);

        return;

      case ActionType.SET_LIST_FILTER:
        Assertion.assertValue(params.filter, 'payload.filter');

        const filter = params?.filter || this.getValue(SelectorType.LIST_FILTER);

        this.setValue(SelectorType.LIST_FILTER, filter);

        return;

      default:
        throw this.unhandledCommandOrActionType(actionType);
    }
  }

}
