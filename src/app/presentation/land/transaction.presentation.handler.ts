/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, Command, Cache } from '@app/core';

import { AbstractPresentationHandler, StateValues } from '@app/core/presentation/presentation.handler';

import { TransactionDataService } from '@app/data-services';

import { Agency, RecorderOffice, TransactionFilter, TransactionType,
         EmptyTransaction, EmptyTransactionFilter } from '@app/models';
import { Observable } from 'rxjs';


export enum ActionType {
  SELECT_TRANSACTION = 'Land.Transactions.Action.SelectTransaction',
  SET_LIST_FILTER = 'Land.Transactions.Action.SetListFilter',
  UNSELECT_TRANSACTION = 'Land.Transactions.Action.UnselectTransaction'
}


export enum CommandType {
  CREATE_TRANSACTION = 'Land.Transactions.Command.CreateTransaction',
  UPDATE_TRANSACTION = 'Land.Transactions.Command.UpdateTransaction',
}


export enum EffectType {
  SET_LIST_FILTER = ActionType.SET_LIST_FILTER
}


export enum SelectorType {
  LIST_FILTER = 'Land.Transactions.Selectors.TransactionListFilter',
  SELECTED_TRANSACTION = 'Land.Transactions.Selectors.SelectedTransaction',
  TRANSACTION_LIST = 'Land.Transactions.Selectors.TransactionList',
  TRANSACTION_TYPE_LIST = 'Land.Transactions.Selectors.TransactionTypeList',
  AGENCY_LIST = 'Land.Transactions.Selectors.AgencyList',
  RECORDER_OFFICE_LIST = 'Land.Transactions.Selectors.RecorderOfficeList',
}


const initialState: StateValues = [
  { key: SelectorType.LIST_FILTER, value: EmptyTransactionFilter },
  { key: SelectorType.SELECTED_TRANSACTION, value: EmptyTransaction },
  { key: SelectorType.TRANSACTION_LIST, value: [] },
  { key: SelectorType.TRANSACTION_TYPE_LIST, value: new Cache<TransactionType[]>() },
  { key: SelectorType.AGENCY_LIST, value: new Cache<Agency[]>() },
  { key: SelectorType.RECORDER_OFFICE_LIST, value: new Cache<RecorderOffice[]>() },
];


@Injectable()
export class TransactionPresentationHandler extends AbstractPresentationHandler {

  constructor(private data: TransactionDataService) {
    super({
      initialState,
      selectors: SelectorType,
      actions: ActionType,
      effects: EffectType
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

        return super.selectMemoized<U>(selectorType, provider, selectorType, []);

      case SelectorType.AGENCY_LIST:
        provider = () => this.data.getAgencies();

        return super.selectMemoized<U>(selectorType, provider, selectorType, []);

      case SelectorType.RECORDER_OFFICE_LIST:
        provider = () => this.data.getRecorderOffices();

        return super.selectMemoized<U>(selectorType, provider, selectorType, []);

      default:
        return super.select<U>(selectorType, params);

    }
  }


  applyEffects(effectType: EffectType, params?: any): void {
    switch (effectType) {

      case EffectType.SET_LIST_FILTER:
        const filter = this.getValue<TransactionFilter>(SelectorType.LIST_FILTER);

        const transactionList = this.data.getTransactionList(filter);

        this.setValue(SelectorType.TRANSACTION_LIST, transactionList);

        this.dispatch(ActionType.UNSELECT_TRANSACTION);

        return;
      default:
        throw this.unhandledCommandOrActionType(effectType);
    }
  }


  execute<T>(command: Command): Promise<T> {
    switch (command.type as CommandType) {

      // case CommandType.CREATE_TRANSACTION:
      //   return toPromise<U>(
      //     this.useCases.createTransaction(command.payload.procedureType, command.payload.requestedBy)
      //   );

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
