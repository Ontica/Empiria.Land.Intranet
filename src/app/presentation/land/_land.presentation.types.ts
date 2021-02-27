/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */


/* Actions */

import { ActionType as DocumentsRecordingAction } from './recordings.presentation.handler';
export { ActionType as DocumentsRecordingAction } from './recordings.presentation.handler';

import { ActionType as TransactionAction } from './transaction.presentation.handler';
export { ActionType as TransactionAction } from './transaction.presentation.handler';

export type LandActions = DocumentsRecordingAction |
                          TransactionAction;


/* Commands */

import { CommandType as InstrumentsCommandType } from './instruments.presentation.handler';
export { CommandType as InstrumentsCommandType } from './instruments.presentation.handler';

import { CommandType as TransactionCommandType } from './transaction.presentation.handler';
export { CommandType as TransactionCommandType } from './transaction.presentation.handler';

export type LandCommands = InstrumentsCommandType |
                           TransactionCommandType;


/* Effects */

import { EffectType as InstrumentEffectType } from './instruments.presentation.handler';

import { EffectType as TransactionEffectType } from './transaction.presentation.handler';

export type LandEffects = InstrumentEffectType |
                          TransactionEffectType;


/* Selectors */

import { SelectorType as DocumentsRecordingStateSelector } from './recordings.presentation.handler';
export { SelectorType as DocumentsRecordingStateSelector } from './recordings.presentation.handler';


import { SelectorType as InstrumentsStateSelector } from './instruments.presentation.handler';
export { SelectorType as InstrumentsStateSelector } from './instruments.presentation.handler';


import { SelectorType as InstrumentTypesStateSelector } from './instrument-types.presentation.handler';
export { SelectorType as InstrumentTypesStateSelector } from './instrument-types.presentation.handler';


import { SelectorType as LandRepositoryStateSelector } from './repository.presentation.handler';
export { SelectorType as LandRepositoryStateSelector } from './repository.presentation.handler';


import { SelectorType as TransactionStateSelector } from './transaction.presentation.handler';
export { SelectorType as TransactionStateSelector } from './transaction.presentation.handler';


export type LandSelectors = DocumentsRecordingStateSelector |
                            InstrumentsStateSelector |
                            InstrumentTypesStateSelector |
                            LandRepositoryStateSelector |
                            TransactionStateSelector;
