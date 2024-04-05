/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */


import { MainLayoutActions, MainLayoutSelectors } from './main-layout/_main-layout.presentation.types';
export * from './main-layout/_main-layout.presentation.types';

import { AppStatusActions, AppStatusSelectors } from './app-data/_app-data.presentation.types';
export * from './app-data/_app-data.presentation.types';

import { SMSelectors } from './security-management/_security.management.presentation.types';
export * from './security-management/_security.management.presentation.types';

import { LandActions, LandCommands, LandEffects, LandSelectors } from './land/_land.presentation.types';
export * from './land/_land.presentation.types';


/* Exportation types */

export type ActionType = MainLayoutActions | AppStatusActions | LandActions;

export type CommandType = LandCommands;

export type StateEffect = LandEffects;

export type StateSelector = MainLayoutSelectors | AppStatusSelectors | LandSelectors | SMSelectors;
