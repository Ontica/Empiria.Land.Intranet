/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */


import { EffectType as InstrumentEffectType } from './instruments.state.handler';

import { EffectType as TransactionEffectType } from './transaction.state.handler';


export type StateEffect
  = InstrumentEffectType
  | TransactionEffectType;
