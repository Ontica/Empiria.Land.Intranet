/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, OnChanges, OnDestroy } from '@angular/core';

import { Command, EventInfo, isEmpty } from '@app/core';
import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import {
  TransactionAction, TransactionCommandType,
  TransactionStateSelector
} from '@app/core/presentation/presentation-types';

import {
  EmptyInstrument, EmptyPreprocessingData, InstrumentMedia, InstrumentMediaContent,
  PreprocessingData
} from '@app/models';

import { EmptyFileData, FileData, FileViewerData } from '@app/shared/form-controls/file-control/file-control-data';

import { InstrumentFilesEditorEventType } from '@app/views/transactions/transaction-files/transaction-files-uploader.component';

@Component({
  selector: 'emp-land-pre-registration',
  templateUrl: './land-pre-registration.component.html',
})
export class LandPreRegistationComponent implements OnChanges, OnDestroy {

  @Input() transactionUID = 'Empty';

  preprocessingData: PreprocessingData = EmptyPreprocessingData;

  instrumentMainFile: FileData = null;

  instrumentAuxiliaryFile: FileData = null;

  helper: SubscriptionHelper;

  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
  }

  ngOnChanges() {
    this.helper.select<PreprocessingData>(
      TransactionStateSelector.SELECTED_PREPROCESSING_DATA, this.transactionUID)
      .subscribe(x => {
        this.preprocessingData = x;
        this.preprocessingData.instrument = this.isInstrumentEmpty() ?
          EmptyInstrument :
          this.preprocessingData.instrument;
        this.mapInstrumentFileDataFromInstrumentMedia();
      });
  }

  isInstrumentEmpty() {
    return isEmpty(this.preprocessingData.instrument);
  }

  mapInstrumentFileDataFromInstrumentMedia() {
    this.instrumentMainFile = null;
    this.instrumentAuxiliaryFile = null;

    if (this.getInstrumentFileByContent('InstrumentMainFile')) {
      this.instrumentMainFile =
        Object.assign({}, EmptyFileData, this.getInstrumentFileByContent('InstrumentMainFile'));
    }

    if (this.getInstrumentFileByContent('InstrumentAuxiliaryFile')) {
      this.instrumentAuxiliaryFile =
        Object.assign({}, EmptyFileData, this.getInstrumentFileByContent('InstrumentAuxiliaryFile'));
    }
  }

  getInstrumentFileByContent(mediaContent: InstrumentMediaContent): InstrumentMedia {
    const intrumentFile = this.preprocessingData.instrument.media
      .filter(file => file.content === mediaContent);

    if (intrumentFile.length > 0) {
      return intrumentFile[0];
    }

    return null;
  }

  ngOnDestroy() {
    this.uiLayer.dispatch(TransactionAction.UNSELECT_FILE_LIST);

    this.helper.destroy();
  }

  onInstrumentFilesEditorEvent(event: EventInfo): void {
    let payload: any = {};

    switch (event.type as InstrumentFilesEditorEventType) {

      case InstrumentFilesEditorEventType.SUBMIT_INSTRUMENT_FILE_CLICKED:

        payload = {
          instrumentUID: this.preprocessingData.instrument.uid,
          file: event.payload.file.file,
          mediaContent: event.payload.mediaContent,
          fileName: event.payload.fileName
        };

        this.executeCommand(TransactionCommandType.UPLOAD_INSTRUMENT_FILE, payload);

        return;

      case InstrumentFilesEditorEventType.REMOVE_INSTRUMENT_FILE_CLICKED:

        payload = {
          instrumentUID: this.preprocessingData.instrument.uid,
          mediaFileUID: event.payload.mediaContentUID,
        };

        this.executeCommand(TransactionCommandType.REMOVE_INSTRUMENT_FILE, payload);

        return;

      case InstrumentFilesEditorEventType.SHOW_FILE_CLICKED:

        const fileViewerData: FileViewerData = {
          fileList: [event.payload]
        };

        this.uiLayer.dispatch(TransactionAction.SELECT_FILE_LIST, { fileViewerData });

        return;

      case InstrumentFilesEditorEventType.DOWNLOAD_FILE_CLICKED:

        this.executeCommand(TransactionCommandType.DOWNLOAD_INSTRUMENT_FILE, event.payload);

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }

  executeCommand<T>(commandType: TransactionCommandType, payload?: any): Promise<T> {
    const command: Command = {
      type: commandType,
      payload
    };

    return this.uiLayer.execute<T>(command);
  }

}
