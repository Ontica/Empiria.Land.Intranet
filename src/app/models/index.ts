/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */


// By default, use entities as models and only map them when necessary.
//
// Use cases MUST receive model objects as parameters, internally map them to
// entities, and then operate and CONVERT BACK those entities to model objects
// in order to return any information.
// It is important do not LEAK domain entities outside use case boundaries.
//
// However, domain providers MUST receive and return entity objects and are
// responsible of internally convert them to any appropiate data structure
// needed for external services interaction.
//

export * from './_access-control';

export * from './_data-table';

export * from './_dynamic-form-fields';

export * from './_explorer-data';

export * from './reporting';

export * from './certificate';

export * from './e-sign';

export * from './instrument';

export * from './land-list';

export * from './media-file';

export * from './party';

export * from './preprocessing-data';

export * from './record-search';

export * from './recordable-subjects';

export * from './recording-act';

export * from './registration';

export * from './tract-index';

export * from './transaction';

export * from './workflow';
