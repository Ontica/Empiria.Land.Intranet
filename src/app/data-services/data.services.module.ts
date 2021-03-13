/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { FileDownloadService } from './file-services/file-download.service';

import { InstrumentDataService } from './instrument.data.service';
import { RecordableSubjectsDataService } from './recordable-subjects.data.service';
import { RecordingDataService } from './recording.data.service';
import { TransactionDataService } from './transaction.data.service';

import { getSaver, SAVER } from './file-services/saver.provider';


@NgModule({

  providers: [
    FileDownloadService,
    InstrumentDataService,
    RecordableSubjectsDataService,
    RecordingDataService,
    TransactionDataService,

    { provide: SAVER, useFactory: getSaver }
  ]

})
export class DataServicesModule { }
