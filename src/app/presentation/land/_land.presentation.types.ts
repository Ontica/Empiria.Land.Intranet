/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */


/* Actions */

import { ActionType as RecordableSubjectsAction } from './recordable-subjects.presentation.handler';
export { ActionType as RecordableSubjectsAction } from './recordable-subjects.presentation.handler';

import { ActionType as RegistrationAction } from './registration.presentation.handler';
export { ActionType as RegistrationAction } from './registration.presentation.handler';

import { ActionType as TransactionAction } from './transaction.presentation.handler';
export { ActionType as TransactionAction } from './transaction.presentation.handler';

export type LandActions = RecordableSubjectsAction |
                          RegistrationAction |
                          TransactionAction;


/* Commands */

import { CommandType as RegistrationCommandType } from './registration.presentation.handler';
export { CommandType as RegistrationCommandType } from './registration.presentation.handler';

import { CommandType as TransactionCommandType } from './transaction.presentation.handler';
export { CommandType as TransactionCommandType } from './transaction.presentation.handler';

export type LandCommands = RegistrationCommandType |
                           TransactionCommandType;


/* Effects */

import { EffectType as RegistrationEffectType } from './registration.presentation.handler';

import { EffectType as TransactionEffectType } from './transaction.presentation.handler';

export type LandEffects = RegistrationEffectType |
                          TransactionEffectType;


/* Selectors */

import { SelectorType as RegistrationStateSelector } from './registration.presentation.handler';
export { SelectorType as RegistrationStateSelector } from './registration.presentation.handler';


import { SelectorType as RecordableSubjectsStateSelector } from './recordable-subjects.presentation.handler';
export { SelectorType as RecordableSubjectsStateSelector } from './recordable-subjects.presentation.handler';


import { SelectorType as TransactionStateSelector } from './transaction.presentation.handler';
export { SelectorType as TransactionStateSelector } from './transaction.presentation.handler';


export type LandSelectors = RegistrationStateSelector |
                            RecordableSubjectsStateSelector |
                            TransactionStateSelector;
