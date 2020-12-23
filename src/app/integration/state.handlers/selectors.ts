/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { SelectorType as MainUIStateSelector } from '../state.handlers/main-ui.state.handler';
export { SelectorType as MainUIStateSelector } from '../state.handlers/main-ui.state.handler';


import { SelectorType as DocumentsRecordingStateSelector } from './documents-recording.state.handler';
export { SelectorType as DocumentsRecordingStateSelector } from './documents-recording.state.handler';


import { SelectorType as InstrumentsStateSelector } from './instruments.state.handler';
export { SelectorType as InstrumentsStateSelector } from './instruments.state.handler';


import { SelectorType as InstrumentTypesStateSelector } from './instrument-types.state.handler';
export { SelectorType as InstrumentTypesStateSelector } from './instrument-types.state.handler';


import { SelectorType as IssuersStateSelector } from './issuers.state.handler';
export { SelectorType as IssuersStateSelector } from './issuers.state.handler';


import { SelectorType as LandRepositoryStateSelector } from './repository.state.handler';
export { SelectorType as LandRepositoryStateSelector } from './repository.state.handler';


import { SelectorType as TransactionStateSelector } from './transaction.state.handler';
export { SelectorType as TransactionStateSelector } from './transaction.state.handler';


export type StateSelector = MainUIStateSelector |
                            DocumentsRecordingStateSelector |
                            InstrumentsStateSelector |
                            InstrumentTypesStateSelector |
                            IssuersStateSelector |
                            LandRepositoryStateSelector |
                            TransactionStateSelector;
