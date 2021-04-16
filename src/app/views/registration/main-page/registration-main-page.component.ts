/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, OnChanges, OnDestroy, ViewChild } from '@angular/core';

import { Assertion, Command, EventInfo, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { RegistrationCommandType,
         RegistrationStateSelector } from '@app/core/presentation/presentation-types';

import { InstrumentRecording, InstrumentRecordingActions, InstrumentFields,
         EmptyInstrumentRecording, EmptyInstrumentRecordingActions } from '@app/models';

import { InstrumentEditorEventType } from '@app/views/recordable-subjects/instrument/instrument-editor.component';

import {
  FilePrintPreviewComponent
} from '@app/shared/form-controls/file-print-preview/file-print-preview.component';



@Component({
  selector: 'emp-land-registration-main-page',
  templateUrl: './registration-main-page.component.html',
})
export class RegistrationMainPageComponent implements OnChanges, OnDestroy {

  @Input() transactionUID = 'Empty';

  @ViewChild('filePrintPreview', { static: true }) filePrintPreview: FilePrintPreviewComponent;

  instrumentRecording: InstrumentRecording = EmptyInstrumentRecording;
  actions: InstrumentRecordingActions = EmptyInstrumentRecordingActions;

  helper: SubscriptionHelper;

  panelAddState = false;
  submitted = false;

  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnChanges() {
    this.helper.select<InstrumentRecording>(RegistrationStateSelector.TRANSACTION_INSTRUMENT_RECORDING,
                                            this.transactionUID)
      .subscribe(x => {
        this.instrumentRecording = x;
        this.actions = x.actions;

        this.resetPanelState();
      });
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  resetPanelState() {
    this.panelAddState = false;
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

      default:
        throw Assertion.assertNoReachThisCode(`Unrecoginzed event ${event.type}.`);

    }
  }

  // private methods

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
