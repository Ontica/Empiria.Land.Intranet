/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ActionType as MainUIStateAction } from '../state.handlers/main-ui.state.handler';
export { ActionType as MainUIStateAction } from '../state.handlers/main-ui.state.handler';


import { ActionType as ElectronicFilingAction } from './electronic-filing.state.handler';
export { ActionType as ElectronicFilingAction } from './electronic-filing.state.handler';


export type StateAction
  = MainUIStateAction
  | ElectronicFilingAction

;
