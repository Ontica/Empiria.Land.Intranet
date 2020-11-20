/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { SelectorType as MainUIStateSelector } from '../state.handlers/main-ui.state.handler';
export { SelectorType as MainUIStateSelector } from '../state.handlers/main-ui.state.handler';


import { SelectorType as ElectronicFilingStateSelector } from './electronic-filing.state.handler';
export { SelectorType as ElectronicFilingStateSelector } from './electronic-filing.state.handler';

import { SelectorType as LandRepositoryStateSelector } from './repository.state.handler';
export { SelectorType as LandRepositoryStateSelector } from './repository.state.handler';

export type StateSelector = MainUIStateSelector |
                            ElectronicFilingStateSelector |
                            LandRepositoryStateSelector;
