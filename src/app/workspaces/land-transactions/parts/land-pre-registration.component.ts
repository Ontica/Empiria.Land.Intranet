/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';

import { Assertion, Command, EventInfo } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { TransactionAction, TransactionCommandType,
         TransactionStateSelector } from '@app/core/presentation/presentation-types';

import { EmptyPreprocessingData, PreprocessingData } from '@app/models';

import { FileViewerData } from '@app/shared/form-controls/file-control/file-control-data';

import {
  TransactionFilesEventType
} from '@app/views/transactions/transaction-files/transaction-files.component';

@Component({
  selector: 'emp-land-pre-registration',
  templateUrl: './land-pre-registration.component.html',
})
export class LandPreRegistationComponent implements OnChanges, OnInit, OnDestroy {

  @Input() transactionUID = 'Empty';

  @Input() readonly = false;

  isLoading = false;

  preprocessingData: PreprocessingData = EmptyPreprocessingData;

  helper: SubscriptionHelper;


  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.transactionUID) {
      this.uiLayer.dispatch(TransactionAction.SELECT_PREPROCESSING_DATA,
        {transactionUID: this.transactionUID});
      this.isLoading = true;
    }
  }


  ngOnInit() {
    this.helper.select<PreprocessingData>(TransactionStateSelector.SELECTED_PREPROCESSING_DATA)
      .subscribe(x => {
        this.preprocessingData = x;
        this.isLoading = false;
      });
  }


  ngOnDestroy() {
    this.uiLayer.dispatch(TransactionAction.UNSELECT_PREPROCESSING_DATA);
    this.uiLayer.dispatch(TransactionAction.UNSELECT_FILE_LIST);
    this.helper.destroy();
  }


  onTransactionFilesEvent(event: EventInfo): void {
    switch (event.type as TransactionFilesEventType) {

      case TransactionFilesEventType.UPLOAD_FILE_CLICKED:
        Assertion.assertValue(event.payload.transactionUID, 'event.payload.transactionUID');
        Assertion.assertValue(event.payload.mediaContent, 'event.payload.mediaContent');
        Assertion.assertValue(event.payload.file, 'event.payload.file');

        this.executeCommand<PreprocessingData>(TransactionCommandType.UPLOAD_TRANSACTION_FILE, event.payload);

        return;

      case TransactionFilesEventType.REMOVE_FILE_CLICKED:
        Assertion.assertValue(event.payload.transactionUID, 'event.payload.transactionUID');
        Assertion.assertValue(event.payload.mediaFileUID, 'event.payload.mediaFileUID');

        this.executeCommand<PreprocessingData>(TransactionCommandType.REMOVE_TRANSACTION_FILE, event.payload);

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


  private executeCommand<T>(commandType: TransactionCommandType, payload?: any): Promise<T> {
    const command: Command = {
      type: commandType,
      payload
    };

    return this.uiLayer.execute<T>(command);
  }

}
