/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, OnChanges, OnDestroy, ViewChild } from '@angular/core';

import { Assertion, Command, EventInfo, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { InstrumentsRecordingCommandType, InstrumentsRecordingStateSelector } from '@app/core/presentation/presentation-types';

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

  @Input() transactionUID: string = 'Empty';

  @ViewChild('filePrintPreview', { static: true }) filePrintPreview: FilePrintPreviewComponent;

  instrumentRecording: InstrumentRecording = EmptyInstrumentRecording;
  actions: InstrumentRecordingActions = EmptyInstrumentRecordingActions;

  helper: SubscriptionHelper;

  panelAddState = false;

  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnChanges() {
    this.helper.select<InstrumentRecording>(
                                        InstrumentsRecordingStateSelector.TRANSACTION_INSTRUMENT_RECORDING,
                                        this.transactionUID)
      .subscribe(x => {

        console.log('ngOnChanges', x);

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
    switch (event.type) {
      case InstrumentEditorEventType.PRINT_REGISTRATION_STAMP_MEDIA:
        this.filePrintPreview.open(this.instrumentRecording.stampMedia.url,
                                   this.instrumentRecording.stampMedia.mediaType);
        return;

      case InstrumentEditorEventType.UPDATE_INSTRUMENT:
        Assertion.assertValue(event.payload, 'event.payload');
        Assertion.assertValue(event.payload.instrumentFields, 'event.payload.instruementFields');

        this.updateInstrument(event.payload.instrumentFields as InstrumentFields);
        return;

      default:
        throw Assertion.assertNoReachThisCode(`Unrecoginzed event ${event.type}.`);

    }
  }

  // private methods

  private updateInstrument(instrumentFields: InstrumentFields) {
    let commandType = InstrumentsRecordingCommandType.UPDATE_RECORDED_INSTRUMENT;
    if (isEmpty(this.instrumentRecording)) {
      commandType = InstrumentsRecordingCommandType.CREATE_INSTRUMENT_RECORDING;
    }

    const command: Command = {
      type: commandType,
      payload: {
        transactionUID: this.transactionUID,
        instrument: instrumentFields
      }
    };

    this.uiLayer.execute(command);
  }

}
