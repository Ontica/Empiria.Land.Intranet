/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, CommandResult } from '@app/core';

import { AbstractStateHandler, StateValues } from '@app/core/presentation/state-handler';

import { DocumentsRecordingUseCases } from '@app/domain/use-cases';

import { EmptyRecordingAct } from '@app/domain/models';


export enum ActionType {
  SELECT_RECORDING_ACT  = 'OnePoint.UI-Action.ElectronicFiling.SelectRecordingAct',
  UNSELECT_RECORDING_ACT= 'OnePoint.UI-Action.ElectronicFiling.UnselectRecordingAct',
}


export enum SelectorType {
  SELECTED_RECORDING_ACT = 'OnePoint.UI-Item.ElectronicFiling.SelectedRecordingAct'
}


enum CommandEffectType {

}


const initialState: StateValues = [
  { key: SelectorType.SELECTED_RECORDING_ACT, value: EmptyRecordingAct },
];


@Injectable()
export class DocumentsRecordingStateHandler extends AbstractStateHandler {

  constructor(private useCases: DocumentsRecordingUseCases) {
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

      case ActionType.SELECT_RECORDING_ACT:
        Assertion.assertValue(payload.request, 'payload.request');

        this.setValue(SelectorType.SELECTED_RECORDING_ACT, payload.request);
        return;

      case ActionType.UNSELECT_RECORDING_ACT:
        this.setValue(SelectorType.SELECTED_RECORDING_ACT, EmptyRecordingAct);
        return;

      default:
        throw this.unhandledCommandOrActionType(actionType);
    }
  }

}
