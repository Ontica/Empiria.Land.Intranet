/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { CommandType as InstrumentsCommandType } from './instruments.command.handler';
export { CommandType as InstrumentsCommandType } from './instruments.command.handler';

import { CommandType as TransactionCommandType } from './transaction.command.handler';
export { CommandType as TransactionCommandType } from './transaction.command.handler';

export type CommandType
  = InstrumentsCommandType
  | TransactionCommandType;
