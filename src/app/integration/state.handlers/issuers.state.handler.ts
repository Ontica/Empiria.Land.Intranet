/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion } from '@app/core';

import { AbstractStateHandler, StateValues } from '@app/core/presentation/state-handler';
import { IssuersApiProvider } from '@app/domain/providers';


export enum ActionType {
  LOAD_ISSUER_LIST = 'Land.UI-Action.Issuers.LoadIssuersList',
}


export enum SelectorType {
  ISSUER_LIST = 'Land.UI-Item.Issuers.List',
}


const initialState: StateValues = [
  { key: SelectorType.ISSUER_LIST, value: [] },
];


@Injectable()
export class IssuersStateHandler extends AbstractStateHandler {


  constructor(private service: IssuersApiProvider) {
    super({
      initialState,
      selectors: SelectorType,
      actions: ActionType
    });
  }



  dispatch<U>(actionType: ActionType, payload?: any): Promise<U> | void {
    switch (actionType) {
      case ActionType.LOAD_ISSUER_LIST:
        Assertion.assertValue(payload.instrumentType, 'payload.InstrumentType');

        return this.setValue<U>(SelectorType.ISSUER_LIST,
                                this.service.getIssuerList(payload.instrumentType,
                                                           payload.instrumentKind,
                                                           payload.onDate,
                                                           payload.keywords));

      default:
        throw this.unhandledCommandOrActionType(actionType);
    }
  }

}
