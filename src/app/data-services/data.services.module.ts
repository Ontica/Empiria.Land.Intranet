/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { InstrumentDataService } from './instrument.data.service';
import { InstrumentTypeDataService } from './instrument-type.data.service';
import { RecordingDataService } from './recording.data.service';
import { RepositoryDataService } from './repository.data.service';
import { TransactionDataService } from './transaction.data.service';


@NgModule({

  providers: [
    InstrumentDataService,
    InstrumentTypeDataService,
    RecordingDataService,
    RepositoryDataService,
    TransactionDataService
  ]

})
export class DataServicesModule { }
