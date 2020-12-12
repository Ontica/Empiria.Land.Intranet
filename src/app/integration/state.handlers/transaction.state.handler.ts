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
  LOAD_REQUESTS_LIST = 'Land.UI-Action.Transaction.LoadRequestList',
  SELECT_REQUEST     = 'Land.UI-Action.Transaction.SelectRequest',
  UNSELECT_REQUEST   = 'Land.UI-Action.Transaction.UnselectRequest'
}


export enum SelectorType {
  REQUESTS_LIST    = 'Land.UI-Item.Transaction.List',
  LIST_FILTER      = 'Land.UI-Item.Transaction.Filter',
  SELECTED_REQUEST = 'Land.UI-Item.Transaction.SelectedRequest'
}


enum CommandEffectType {

}


const initialState: StateValues = [
  { key: SelectorType.REQUESTS_LIST, value: [] },
  { key: SelectorType.LIST_FILTER, value: EmptyTransactionFilter },
  { key: SelectorType.SELECTED_REQUEST, value: EmptyTransaction }
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

      case ActionType.LOAD_REQUESTS_LIST:
        const filter = payload?.filter || this.getValue(SelectorType.LIST_FILTER);

        this.setValue(SelectorType.LIST_FILTER, filter);
        return this.setValue<U>(SelectorType.REQUESTS_LIST,
                                this.useCases.getRequests(filter));


      case ActionType.SELECT_REQUEST:
        Assertion.assertValue(payload.request, 'payload.request');

        this.setValue(SelectorType.SELECTED_REQUEST, payload.request);
        return;


      case ActionType.UNSELECT_REQUEST:
        this.setValue(SelectorType.SELECTED_REQUEST, EmptyTransaction);
        return;


      default:
        throw this.unhandledCommandOrActionType(actionType);
    }
  }

}
