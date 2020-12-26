/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, CommandResult } from '@app/core';

import { AbstractStateHandler, StateValues } from '@app/core/presentation/state-handler';

import { TransactionUseCases } from '@app/domain/use-cases';

import { EmptyTransactionFilter, EmptyTransaction } from '@app/domain/models';



export enum ActionType {
  LOAD_TRANSACTION_LIST = 'Land.UI-Action.Transaction.LoadTransactionList',
  SELECT_TRANSACTION = 'Land.UI-Action.Transaction.SelectTransaction',
  UNSELECT_TRANSACTION = 'Land.UI-Action.Transaction.UnselectTransaction',
}


export enum SelectorType {
  TRANSACTION_LIST = 'Land.Transactions.TransactionList',
  LIST_FILTER = 'Land.Transactions.TransactionList.Filter',
  SELECTED_TRANSACTION = 'Land.Transactions.SelectedTransaction',
}


enum CommandEffectType {

}


const initialState: StateValues = [
  { key: SelectorType.TRANSACTION_LIST, value: [] },
  { key: SelectorType.LIST_FILTER, value: EmptyTransactionFilter },
  { key: SelectorType.SELECTED_TRANSACTION, value: EmptyTransaction },
];


@Injectable()
export class TransactionStateHandler extends AbstractStateHandler {


  constructor(private useCases: TransactionUseCases) {
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

      case ActionType.LOAD_TRANSACTION_LIST:
        const filter = payload?.filter || this.getValue(SelectorType.LIST_FILTER);
        this.setValue(SelectorType.LIST_FILTER, filter);

        return this.setValue<U>(SelectorType.TRANSACTION_LIST,
                                this.useCases.getTransactionList(filter));


      case ActionType.SELECT_TRANSACTION:
        Assertion.assertValue(payload.request, 'payload.request');
        this.setValue(SelectorType.SELECTED_TRANSACTION, payload.request);
        return;


      case ActionType.UNSELECT_TRANSACTION:
        this.setValue(SelectorType.SELECTED_TRANSACTION, EmptyTransaction);
        return;


      default:
        throw this.unhandledCommandOrActionType(actionType);
    }
  }

}
