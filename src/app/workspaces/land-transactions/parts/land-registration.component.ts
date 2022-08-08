/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Assertion, Command, EventInfo, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { RegistrationAction, RegistrationCommandType, RegistrationStateSelector,
         TransactionAction } from '@app/core/presentation/presentation-types';

import { InstrumentRecording, InstrumentFields, EmptyInstrumentRecording, RecordingActTypeGroup,
         EmptyInstrumentRecordingActions  } from '@app/models';

import {
  InstrumentEditorEventType
} from '@app/views/recordable-subjects/instrument/instrument-editor.component';

import {
  FilePrintPreviewComponent
} from '@app/shared/form-controls/file-print-preview/file-print-preview.component';

import {
  RecordingActCreatorEventType
} from '@app/views/registration/recording-acts/recording-act-creator.component';

import {
  RecordingActsListEventType
} from '@app/views/registration/recording-acts/recording-acts-list.component';

import {
  TransactionFilesEventType
} from '@app/views/transactions/transaction-files/transaction-files.component';

import { FileViewerData } from '@app/shared/form-controls/file-control/file-control-data';


@Component({
  selector: 'emp-land-registration',
  templateUrl: './land-registration.component.html',
})
export class LandRegistrationComponent implements OnInit, OnChanges, OnDestroy {

  @Input() transactionUID = '';

  @ViewChild('filePrintPreview', { static: true }) filePrintPreview: FilePrintPreviewComponent;

  instrumentRecording: InstrumentRecording = EmptyInstrumentRecording;

  panelAddState = false;

  isLoading = false;

  submitted = false;

  recordingActTypeGroupList: RecordingActTypeGroup[] = [];

  helper: SubscriptionHelper;

  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnChanges() {
    this.uiLayer.dispatch(RegistrationAction.SELECT_TRANSACTION_INSTRUMENT_RECORDINGT,
      {transactionUID: this.transactionUID});
    this.isLoading = true;
  }


  ngOnInit(){
    this.helper.select<InstrumentRecording>(RegistrationStateSelector.TRANSACTION_INSTRUMENT_RECORDING)
      .subscribe(x => {
        this.instrumentRecording = x;
        this.instrumentRecording.actions = x.actions ?? EmptyInstrumentRecordingActions;
        this.isLoading = false;
        if (!isEmpty(this.instrumentRecording)) {
          this.loadData();
          this.resetPanelState();
        }
      });
  }


  ngOnDestroy() {
    this.helper.destroy();
    this.uiLayer.dispatch(RegistrationAction.UNSELECT_TRANSACTION_INSTRUMENT_RECORDING);
    this.uiLayer.dispatch(TransactionAction.UNSELECT_FILE_LIST);
  }


  resetPanelState() {
    this.panelAddState = false;
  }


  onTransactionFilesEvent(event: EventInfo): void {
    switch (event.type as TransactionFilesEventType) {

      case TransactionFilesEventType.SHOW_FILE_CLICKED:

        const fileViewerData: FileViewerData = {
          fileList: [event.payload.file]
        };

        this.uiLayer.dispatch(TransactionAction.SELECT_FILE_LIST, { fileViewerData });

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onInstrumentEditorEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type) {
      case InstrumentEditorEventType.PRINT_REGISTRATION_STAMP_MEDIA:
        this.filePrintPreview.open(this.instrumentRecording.stampMedia.url,
                                   this.instrumentRecording.stampMedia.mediaType);
        return;

      case InstrumentEditorEventType.UPDATE_INSTRUMENT:
        Assertion.assertValue(event.payload, 'event.payload');
        Assertion.assertValue(event.payload.instrumentFields, 'event.payload.instruementFields');

        const commandType = isEmpty(this.instrumentRecording) ?
          RegistrationCommandType.CREATE_INSTRUMENT_RECORDING :
          RegistrationCommandType.UPDATE_RECORDED_INSTRUMENT;

        const payload = {
          transactionUID: this.transactionUID,
          instrument: event.payload.instrumentFields as InstrumentFields
        };

        this.executeCommand(commandType, payload);
        return;

      case InstrumentEditorEventType.CLOSE_REGISTRATION:

        this.executeCommand(RegistrationCommandType.CLOSE_REGISTRATION,
                           { instrumentRecordingUID : this.instrumentRecording.uid });
        return;

      case InstrumentEditorEventType.OPEN_REGISTRATION:

        this.executeCommand(RegistrationCommandType.OPEN_REGISTRATION,
                           { instrumentRecordingUID : this.instrumentRecording.uid });
        return;


      case InstrumentEditorEventType.EDITION_MODE_CHANGED:

        return;

      default:
        throw Assertion.assertNoReachThisCode(`Unrecoginzed event ${event.type}.`);
    }
  }


  onRecordingActCreatorEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type as RecordingActCreatorEventType) {
      case RecordingActCreatorEventType.APPEND_RECORDING_ACT:
        Assertion.assertValue(event.payload.instrumentRecordingUID, 'event.payload.instrumentRecordingUID');
        Assertion.assertValue(event.payload.registrationCommand, 'event.payload.registrationCommand');
        this.executeCommand(RegistrationCommandType.APPEND_RECORDING_ACT, event.payload);
        return;

      default:
        throw Assertion.assertNoReachThisCode(`Unrecoginzed event ${event.type}.`);
    }
  }


  onRecordingActsListEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type as RecordingActsListEventType) {
      case RecordingActsListEventType.SELECT_RECORDABLE_SUBJECT:
        this.uiLayer.dispatch(RegistrationAction.SELECT_RECORDABLE_SUBJECT, event.payload );
        return;

      case RecordingActsListEventType.SELECT_RECORDING_ACT:
        this.uiLayer.dispatch(RegistrationAction.SELECT_RECORDING_ACT, event.payload );
        return;

      case RecordingActsListEventType.REMOVE_RECORDING_ACT:
        this.executeCommand(RegistrationCommandType.REMOVE_RECORDING_ACT, event.payload);
        return;

      default:
        throw Assertion.assertNoReachThisCode(`Unrecoginzed event ${event.type}.`);
    }
  }


  private loadData(){
    this.helper.select<RecordingActTypeGroup[]>(
      RegistrationStateSelector.RECORDING_ACT_TYPES_LIST_FOR_INSTRUMENT,
      { instrumentUID: this.instrumentRecording.instrument.uid })
      .toPromise()
      .then(x => this.recordingActTypeGroupList = x);
  }


  private executeCommand<T>(commandType: any, payload?: any): Promise<T> {

    this.submitted = true;

    const command: Command = {
      type: commandType,
      payload
    };

    return this.uiLayer.execute<T>(command)
      .finally(() => this.submitted = false);
  }

}
