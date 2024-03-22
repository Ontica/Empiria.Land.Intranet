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

export * from './_access-control.data.service';

export * from './file-services/file-download.service';

export * from './certification.data.service';

export * from './e-sign.data.service';

export * from './recordable-subjects.data.service';

export * from './recording.data.service';

export * from './search-services.data.service';

export * from './transaction.data.service';
