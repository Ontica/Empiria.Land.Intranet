/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { AccessControlDataService } from './_access-control.data.service';

import { CertificationDataService } from './certification.data.service';
import { ESignDataService } from './e-sign.data.service';
import { RecordableSubjectsDataService } from './recordable-subjects.data.service';
import { RecordingDataService } from './recording.data.service';
import { SearchServicesDataService } from './search-services.data.service';
import { TransactionDataService } from './transaction.data.service';

import { FileDownloadService } from './file-services/file-download.service';
import { getSaver, SAVER } from './file-services/saver.provider';


@NgModule({

  providers: [
    AccessControlDataService,
    CertificationDataService,
    ESignDataService,
    FileDownloadService,
    RecordableSubjectsDataService,
    RecordingDataService,
    SearchServicesDataService,
    TransactionDataService,

    { provide: SAVER, useFactory: getSaver }
  ]

})
export class DataServicesModule { }
