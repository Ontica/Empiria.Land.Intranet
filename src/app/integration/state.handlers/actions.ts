/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ActionType as MainUIStateAction } from '../state.handlers/main-ui.state.handler';
export { ActionType as MainUIStateAction } from '../state.handlers/main-ui.state.handler';

import { ActionType as DocumentsRecordingAction } from './recordings.state.handler';
export { ActionType as DocumentsRecordingAction } from './recordings.state.handler';

import { ActionType as TransactionAction } from './transaction.state.handler';
export { ActionType as TransactionAction } from './transaction.state.handler';


export type StateAction
  = MainUIStateAction
  | DocumentsRecordingAction
  | TransactionAction;
