/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Inject, Injectable, InjectionToken } from '@angular/core';

import { Assertion, Command, CommandHandler, CommandResult,
        createCommand as createCommandAlias } from '@app/core';

import { PresentationState } from './presentation.state';

import { CommandType } from './commands';
import { MainUIStateAction } from '@app/integration/state.handlers/actions';


export const COMMAND_HANDLERS =
                new InjectionToken<CommandHandler[]>('PresentationCommandHandlers');


@Injectable()
export class FrontController {

  private processing = false;

  constructor(@Inject(COMMAND_HANDLERS) private handlers: CommandHandler[],
              private presentation: PresentationState) { }


  get isProcessing() {
    return this.processing;
  }


  createCommand(type: CommandType, payload?: any): Command {
    return createCommandAlias(type, payload);
  }


  dispatch(command: Command): void;

  dispatch<U>(command: Command): Promise<U>;

  dispatch(commandType: CommandType, payload?: any): void;

  dispatch<U>(commandType: CommandType, payload?: any): Promise<U>;


  dispatch<U>(commandOrCommandType: Command | CommandType, payload?: any): Promise<U> {
    Assertion.assertValue(commandOrCommandType, 'commandOrCommandType');

    if (typeof commandOrCommandType === 'string') {
      const command = this.createCommand(commandOrCommandType as CommandType, payload);
      return this.dispatchImplementation<U>(command);
    } else {
      return this.dispatchImplementation<U>(commandOrCommandType);
    }
  }


  // private methods


  private afterCommandExecution(command: Command, result: any) {
    const commandResult: CommandResult = { ...command, result };

    this.presentation.applyEffects(commandResult);
    this.endProcessing();
  }


  private dispatchImplementation<U>(command: Command): Promise<U> {
    if (this.isProcessing) {
      throw new Error('FrontController is processing a previous command. Please try again later.');
    }

    try {
      this.startProcessing();

      const commandHandler: CommandHandler = this.selectCommandHandler(command);

      return commandHandler.execute<U>(command)
        .then(x => {
          this.afterCommandExecution(command, x);
          return x;

        }).catch(e => {
          this.whenCommandExecutionFails(command, e);
          throw e;
        });

    } catch (e) {
      this.endProcessing();
      throw e;
    }
  }


  private endProcessing(): void {
    this.processing = false;
    this.presentation.dispatch(MainUIStateAction.SET_IS_PROCESSING_FLAG, false);
  }


  private selectCommandHandler(command: Command): CommandHandler {
    for (const handler of this.handlers) {
      if (handler.commands.includes(command.type)) {
        return handler;
      }
    }
    throw Assertion.assertNoReachThisCode(`There is not defined a command handler for command type '${command.type}'.`);
  }


  private startProcessing(): void {
    this.processing = true;
    this.presentation.dispatch(MainUIStateAction.SET_IS_PROCESSING_FLAG, true);
  }


  private whenCommandExecutionFails(command: Command, error: any) {
    this.endProcessing();

    console.log(`There was a problem executing command ${command.type} in FrontController.`, error);
  }

}
