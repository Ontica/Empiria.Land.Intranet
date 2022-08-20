/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';

import { Assertion, Command, EventInfo } from '@app/core';

import { Subscription } from 'rxjs';

import { PresentationLayer } from '@app/core/presentation';

import { TransactionAction, TransactionCommandType  } from '@app/core/presentation/presentation-types';

import { TransactionDataService } from '@app/data-services';

import { EmptyPreprocessingData, PreprocessingData } from '@app/models';

import { FileViewerData } from '@app/shared/form-controls/file-control/file-control-data';

import {
  TransactionFilesEventType
} from '@app/views/transactions/transaction-files/transaction-files.component';


@Component({
  selector: 'emp-land-pre-registration',
  templateUrl: './land-pre-registration.component.html',
})
export class LandPreRegistationComponent implements OnChanges, OnDestroy {

  @Input() transactionUID = 'Empty';

  @Input() readonly = false;

  isLoading = false;

  preprocessingData: PreprocessingData = EmptyPreprocessingData;

  suscription: Subscription;


  constructor(private uiLayer: PresentationLayer,
              private transactionData: TransactionDataService) {
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.transactionUID) {
      this.unsuscribePreprocessingData();
      this.getPreprocessingData();
    }
  }


  ngOnDestroy() {
    this.unsuscribePreprocessingData();
  }


  onTransactionFilesEvent(event: EventInfo): void {
    switch (event.type as TransactionFilesEventType) {

      case TransactionFilesEventType.UPLOAD_FILE_CLICKED:
        Assertion.assertValue(event.payload.transactionUID, 'event.payload.transactionUID');
        Assertion.assertValue(event.payload.mediaContent, 'event.payload.mediaContent');
        Assertion.assertValue(event.payload.file, 'event.payload.file');

        this.executeCommand<PreprocessingData>(TransactionCommandType.UPLOAD_TRANSACTION_FILE, event.payload)
          .then(x => this.preprocessingData = x);

        return;

      case TransactionFilesEventType.REMOVE_FILE_CLICKED:
        Assertion.assertValue(event.payload.transactionUID, 'event.payload.transactionUID');
        Assertion.assertValue(event.payload.mediaFileUID, 'event.payload.mediaFileUID');

        this.executeCommand<PreprocessingData>(TransactionCommandType.REMOVE_TRANSACTION_FILE, event.payload)
          .then(x => this.preprocessingData = x);

        return;

      case TransactionFilesEventType.SHOW_FILE_CLICKED:
        Assertion.assertValue(event.payload.file, 'event.payload.file');

        const fileViewerData: FileViewerData = {fileList: [event.payload.file]};

        this.uiLayer.dispatch(TransactionAction.SELECT_FILE_LIST, {fileViewerData});

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private getPreprocessingData() {
    this.isLoading = true;

    this.suscription = this.transactionData.getTransactionPreprocessingData(this.transactionUID)
      .subscribe(x => {
        this.preprocessingData = x;
        this.isLoading = false;
      }, error => this.isLoading = false);
  }


  private unsuscribePreprocessingData() {
    if (this.suscription) {
      this.suscription.unsubscribe();
    }
  }


  private executeCommand<T>(commandType: TransactionCommandType, payload?: any): Promise<T> {
    const command: Command = {
      type: commandType,
      payload
    };

    return this.uiLayer.execute<T>(command);
  }

}
