/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion } from '@app/core';

import { AbstractPresentationHandler, StateValues } from '@app/core/presentation/presentation.handler';

import { TransactionDataService } from '@app/data-services';

import { EmptyRecordableSubjectFields } from '@app/models/recordable-subjects';


export enum ActionType {
  SELECT_RECORDING_ACT = 'Land.Recording.Action.SelectRecordingAct',
  UNSELECT_RECORDING_ACT = 'Land.Recording.Action.UnselectRecordingAct',
}


export enum SelectorType {
  SELECTED_RECORDING_ACT = 'Land.Recording.Selector.SelectedRecordingAct'
}


const initialState: StateValues = [
  { key: SelectorType.SELECTED_RECORDING_ACT, value: EmptyRecordableSubjectFields },
];


@Injectable()
export class RecordingsPresentationHandler extends AbstractPresentationHandler {

  constructor(private data: TransactionDataService) { // Temp: RecordingDataService
    super({
      initialState,
      selectors: SelectorType,
      actions: ActionType
    });
  }

  dispatch(actionType: ActionType, params?: any): void {
    switch (actionType) {

      case ActionType.SELECT_RECORDING_ACT:
        Assertion.assertValue(params.recordingAct, 'payload.recordingAct');
        this.setValue(SelectorType.SELECTED_RECORDING_ACT, params.recordingAct);
        return;

      case ActionType.UNSELECT_RECORDING_ACT:
        this.setValue(SelectorType.SELECTED_RECORDING_ACT, EmptyRecordableSubjectFields);
        return;

      default:
        throw this.unhandledCommandOrActionType(actionType);
    }
  }

}
