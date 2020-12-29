/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion } from '@app/core';

import { AbstractStateHandler, StateValues } from '@app/core/presentation/state-handler';

import { RecordingDataService } from '@app/data-services';

import { EmptyRecordingAct } from '@app/models';


export enum ActionType {
  SELECT_RECORDING_ACT   = 'Land.Recording.Action.SelectRecordingAct',
  UNSELECT_RECORDING_ACT = 'Land.Recording.Action.UnselectRecordingAct',
}


export enum SelectorType {
  SELECTED_RECORDING_ACT = 'Land.Recording.Selector.SelectedRecordingAct'
}


const initialState: StateValues = [
  { key: SelectorType.SELECTED_RECORDING_ACT, value: EmptyRecordingAct },
];


@Injectable()
export class RecordingsStateHandler extends AbstractStateHandler {

  constructor(private data: RecordingDataService) {
    super({
      initialState,
      selectors: SelectorType,
      actions: ActionType
    });
  }

  dispatch(actionType: ActionType, params?: any): void {
    switch (actionType) {

      case ActionType.SELECT_RECORDING_ACT:
        Assertion.assertValue(params.transaction, 'params.transaction');

        this.setValue(SelectorType.SELECTED_RECORDING_ACT, params.transaction);
        return;

      case ActionType.UNSELECT_RECORDING_ACT:
        this.setValue(SelectorType.SELECTED_RECORDING_ACT, EmptyRecordingAct);
        return;

      default:
        throw this.unhandledCommandOrActionType(actionType);
    }
  }

}
