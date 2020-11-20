/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, CommandResult } from '@app/core';

import { AbstractStateHandler, StateValues } from '@app/core/presentation/state-handler';

import { ElectronicFilingUseCases } from '@app/domain/use-cases';

import { EmptyEFilingRequestFilter, EmptyEFilingRequest } from '@app/domain/models';

import { ElectronicFilingCommandType } from '../command.handlers/commands';


export enum ActionType {
  LOAD_REQUESTS_LIST = 'OnePoint.UI-Action.ElectronicFiling.LoadRequestList',
  SELECT_REQUEST     = 'OnePoint.UI-Action.ElectronicFiling.SelectRequest',
  UNSELECT_REQUEST   = 'OnePoint.UI-Action.ElectronicFiling.UnselectRequest'
}


export enum SelectorType {
  REQUESTS_LIST    = 'OnePoint.UI-Item.ElectronicFiling.List',
  LIST_FILTER      = 'OnePoint.UI-Item.ElectronicFiling.Filter',
  SELECTED_REQUEST = 'OnePoint.UI-Item.ElectronicFiling.SelectedRequest'
}


enum CommandEffectType {
  CREATE_EFILING_REQUEST  = ElectronicFilingCommandType.CREATE_EFILING_REQUEST,
  DELETE_EFILING_REQUEST  = ElectronicFilingCommandType.DELETE_EFILING_REQUEST,
  UPDATE_EFILING_REQUEST  = ElectronicFilingCommandType.UPDATE_EFILING_REQUEST,
  UPDATE_APPLICATION_FORM = ElectronicFilingCommandType.UPDATE_APPLICATION_FORM,
  SIGN                    = ElectronicFilingCommandType.SIGN,
  REVOKE_SIGN             = ElectronicFilingCommandType.REVOKE_SIGN,
  GENERATE_PAYMENT_ORDER  = ElectronicFilingCommandType.GENERATE_PAYMENT_ORDER,
  REQUEST_SUBMISSION      = ElectronicFilingCommandType.REQUEST_SUBMISSION
}


const initialState: StateValues = [
  { key: SelectorType.REQUESTS_LIST, value: [] },
  { key: SelectorType.LIST_FILTER, value: EmptyEFilingRequestFilter },
  { key: SelectorType.SELECTED_REQUEST, value: EmptyEFilingRequest }
];


@Injectable()
export class ElectronicFilingStateHandler extends AbstractStateHandler {


  constructor(private useCases: ElectronicFilingUseCases) {
    super({
      initialState,
      selectors: SelectorType,
      actions: ActionType,
      effects: CommandEffectType
    });
  }


  applyEffects(command: CommandResult): void {
    switch ((command.type as any) as CommandEffectType) {

      case CommandEffectType.CREATE_EFILING_REQUEST:
        this.stateUpdater.appendToStart(SelectorType.REQUESTS_LIST, command.result);
        this.setValue(SelectorType.SELECTED_REQUEST, command.result);

        return;

      case CommandEffectType.DELETE_EFILING_REQUEST:
        this.stateUpdater.removeEntity(SelectorType.REQUESTS_LIST, command.payload.request);

        this.dispatch(ActionType.UNSELECT_REQUEST);
        this.dispatch(ActionType.LOAD_REQUESTS_LIST);

        return;

      case CommandEffectType.UPDATE_APPLICATION_FORM:
      case CommandEffectType.UPDATE_EFILING_REQUEST:
      case CommandEffectType.SIGN:
      case CommandEffectType.REVOKE_SIGN:
      case CommandEffectType.GENERATE_PAYMENT_ORDER:
      case CommandEffectType.REQUEST_SUBMISSION:
        this.stateUpdater.replaceEntity(SelectorType.REQUESTS_LIST, command.result);
        this.setValue(SelectorType.SELECTED_REQUEST, command.result);
        return;

      default:
        throw this.unhandledCommandOrActionType(command);
    }
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
        this.setValue(SelectorType.SELECTED_REQUEST, EmptyEFilingRequest);
        return;


      default:
        throw this.unhandledCommandOrActionType(actionType);
    }
  }

}
