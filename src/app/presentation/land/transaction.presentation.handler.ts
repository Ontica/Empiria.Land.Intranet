/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, Command } from '@app/core';

import { AbstractPresentationHandler, StateValues } from '@app/core/presentation/presentation.handler';

import { TransactionDataService } from '@app/data-services';

import { EmptyTransaction, EmptyTransactionFilter, TransactionFilter } from '@app/models';
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
}


const initialState: StateValues = [
  { key: SelectorType.LIST_FILTER, value: EmptyTransactionFilter },
  { key: SelectorType.SELECTED_TRANSACTION, value: EmptyTransaction },
  { key: SelectorType.TRANSACTION_LIST, value: [] },
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


  select<T>(selectorType: SelectorType, params?: any): Observable<T> {
    switch (selectorType) {

      case SelectorType.TRANSACTION_LIST:
        return super.select<T>(SelectorType.TRANSACTION_LIST);

      case SelectorType.LIST_FILTER:
        return super.select<T>(SelectorType.LIST_FILTER);

      default:
        return super.select<T>(selectorType, params);

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


  execute<U>(command: Command): Promise<U> {
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
