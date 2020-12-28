/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Inject, Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import { Assertion } from '@app/core';

import { StateHandler } from './state-handler';
import { StateAction, StateEffect, StateSelector } from './state.commands';


export const STATE_HANDLERS =
                new InjectionToken<StateHandler[]>('PresentationStateHandlers');


@Injectable()
export class PresentationState {

  constructor(@Inject(STATE_HANDLERS) private registeredHandlers: StateHandler[]) { }


  applyEffects(effectType: StateEffect, payload?: any): void {
    Assertion.assertValue(effectType, 'effectType');

    const stateHandler = this.tryGetEffectsHandler(effectType);

    if (stateHandler) {
      stateHandler.applyEffects(effectType, payload);
    }
  }

  dispatch(actionType: StateAction, params?: any): void {
    Assertion.assertValue(actionType, 'actionType');

    const stateHandler = this.getStateHandlerForAction(actionType);

    stateHandler.dispatch(actionType, params);

    this.applyEffects(actionType as any as StateEffect);
  }


  getValue<T>(selector: StateSelector): T {
    Assertion.assertValue(selector, 'selector');

    const stateHandler = this.getStateHandlerForSelector(selector);

    return stateHandler.getValue<T>(selector);
  }


  select<T>(selector: StateSelector, params?: any): Observable<T> {
    Assertion.assertValue(selector, 'selector');

    const stateHandler = this.getStateHandlerForSelector(selector);

    return stateHandler.select<T>(selector, params);
  }


  // private methods


  private getStateHandlerForAction(actionType: string) {
    for (const handler of this.registeredHandlers) {
      if (handler.actions.includes(actionType)) {
        return handler;
      }
    }
    throw Assertion.assertNoReachThisCode(
      `There is not defined a presentation state handler for action '${actionType}'.`
    );
  }


  private getStateHandlerForSelector(selector: StateSelector): StateHandler {
    for (const handler of this.registeredHandlers) {
      if (handler.selectors.includes(selector)) {
        return handler;
      }
    }
    throw Assertion.assertNoReachThisCode(
      `There is not defined a presentation state handler for selector '${selector}'.`
    );
  }


  private tryGetEffectsHandler(effectType: StateEffect): StateHandler | undefined {
    for (const handler of this.registeredHandlers) {
      if (handler.effects.includes(effectType as unknown as string)) {
        return handler;
      }
    }
    return undefined;
  }

}
