/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Assertion, Command } from '@app/core';

import { StateAction, StateSelector } from './state.commands';
import { CommandType } from './commands';

import { PresentationState } from './presentation.state';
import { FrontController } from './front.controller';


@Injectable()
export class PresentationLayer {

  constructor(private presenter: PresentationState,
              private controller: FrontController) { }


  createCommand(type: CommandType, payload?: any): Command {
    return this.controller.createCommand(type, payload);
  }

  execute(command: Command | CommandType): void;

  execute<T>(commandType: Command | CommandType): Promise<T>;

  execute<T>(command: Command | CommandType): Promise<T> | void {
    Assertion.assertValue(command, 'command');

    return this.controller.execute<T>(command);
  }

  dispatch(actionType: StateAction, payload?: any): void {
    Assertion.assertValue(actionType, 'actionType');

    return this.presenter.dispatch(actionType, payload);
  }


  select<T>(selector: StateSelector, params?: any): Observable<T> {
    Assertion.assertValue(selector, 'selector');

    return this.presenter.select<T>(selector, params);
  }

  selectValue<T>(selector: StateSelector): T {
    Assertion.assertValue(selector, 'selector');

    return this.presenter.getValue<T>(selector);
  }

}
