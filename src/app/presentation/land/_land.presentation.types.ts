/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */


/* Actions */

import { ActionType as RecordingActsAction } from './recordings.presentation.handler';
export { ActionType as RecordingActsAction } from './recordings.presentation.handler';

import { ActionType as TransactionAction } from './transaction.presentation.handler';
export { ActionType as TransactionAction } from './transaction.presentation.handler';

export type LandActions = RecordingActsAction |
                          TransactionAction;


/* Commands */

import { CommandType as InstrumentsRecordingCommandType } from './instruments-recording.presentation.handler';
export { CommandType as InstrumentsRecordingCommandType } from './instruments-recording.presentation.handler';

import { CommandType as TransactionCommandType } from './transaction.presentation.handler';
export { CommandType as TransactionCommandType } from './transaction.presentation.handler';

export type LandCommands = InstrumentsRecordingCommandType |
                           TransactionCommandType;


/* Effects */

import { EffectType as InstrumentsRecordingEffectType } from './instruments-recording.presentation.handler';

import { EffectType as TransactionEffectType } from './transaction.presentation.handler';

export type LandEffects = InstrumentsRecordingEffectType |
                          TransactionEffectType;


/* Selectors */

import { SelectorType as InstrumentsRecordingStateSelector } from './instruments-recording.presentation.handler';
export { SelectorType as InstrumentsRecordingStateSelector } from './instruments-recording.presentation.handler';


import { SelectorType as RecordableSubjectsStateSelector } from './recordable-subjects.presentation.handler';
export { SelectorType as RecordableSubjectsStateSelector } from './recordable-subjects.presentation.handler';


import { SelectorType as RecordingActsStateSelector } from './recordings.presentation.handler';
export { SelectorType as RecordingActsStateSelector } from './recordings.presentation.handler';


import { SelectorType as TransactionStateSelector } from './transaction.presentation.handler';
export { SelectorType as TransactionStateSelector } from './transaction.presentation.handler';


export type LandSelectors = RecordingActsStateSelector |
                            InstrumentsRecordingStateSelector |
                            RecordableSubjectsStateSelector |
                            TransactionStateSelector;
