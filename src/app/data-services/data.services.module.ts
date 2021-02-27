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
import { FileDownloadService } from './file-services/file-download.service';
import { getSaver, SAVER } from './file-services/saver.provider';


@NgModule({

  providers: [
    FileDownloadService,
    InstrumentDataService,
    InstrumentTypeDataService,
    RecordingDataService,
    RepositoryDataService,
    TransactionDataService,

    { provide: SAVER, useFactory: getSaver }
  ]

})
export class DataServicesModule { }
