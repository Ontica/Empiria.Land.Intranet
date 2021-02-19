/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, OnChanges, OnDestroy } from '@angular/core';

import { Command, EventInfo, isEmpty } from '@app/core';
import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';
import { InstrumentsCommandType, InstrumentsStateSelector,
         TransactionStateSelector } from '@app/core/presentation/presentation-types';

import { Instrument, EmptyInstrument, RecorderOffice, RecordingSection } from '@app/models';
import { PhysicalRecordingEditorEventType } from './physical-recording/physical-recording-editor.component';
import { PhysicalRecordingListEventType } from './physical-recording/physical-recording-list.component';


@Component({
  selector: 'emp-land-instrument-edition',
  templateUrl: './instrument-edition.component.html',
})
export class InstrumentEditionComponent implements OnChanges, OnDestroy {

  @Input() transactionUID: string = 'Empty';

  @Input() canEdit: boolean = false;

  instrument: Instrument = EmptyInstrument;

  recorderOfficeList: RecorderOffice[] = [];

  recordingSectionList: RecordingSection[] = [];

  helper: SubscriptionHelper;

  panelAddPhysicalRecordingState: boolean = false;

  submittedData: boolean = false;

  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
  }

  ngOnChanges() {
    this.helper.select<Instrument>(InstrumentsStateSelector.TRANSACTION_INSTRUMENT, this.transactionUID)
      .subscribe(x => {
        this.instrument = isEmpty(x) ? EmptyInstrument : x;
        this.resetPanelState();
      });

    this.helper.select<RecorderOffice[]>(TransactionStateSelector.RECORDER_OFFICE_LIST, {})
      .subscribe(x => {
        this.recorderOfficeList = x;
      });

    this.helper.select<RecordingSection[]>(TransactionStateSelector.RECORDING_SECTION_LIST, {})
      .subscribe(x => {
        this.recordingSectionList = x;
      });
  }

  ngOnDestroy() {
    this.helper.destroy();
  }

  onPhysicalRecordingEditorEvent(event: EventInfo): void {

    switch (event.type as PhysicalRecordingEditorEventType) {

      case PhysicalRecordingEditorEventType.CREATE_PHYSICAL_RECORDING_CLICKED:

        const payload = {
          transactionUID: this.transactionUID,
          instrumentUID: this.instrument.uid,
          physicalRecording: event.payload
        };

        this.executeCommand<Instrument>(InstrumentsCommandType.CREATE_PHYSICAL_RECORDING, payload)
            .then(x => this.resetPanelState() );

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }

  onPhysicalRecordingListEvent(event: EventInfo): void {

    switch (event.type as PhysicalRecordingListEventType) {

      case PhysicalRecordingListEventType.DELETE_PHYSICAL_RECORDING_CLICKED:

        const payload = {
          transactionUID: this.transactionUID,
          instrumentUID: this.instrument.uid,
          physicalRecordingUID: event.payload
        };

        this.executeCommand(InstrumentsCommandType.DELETE_PHYSICAL_RECORDING, payload);

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }

  private executeCommand<T>(commandType: InstrumentsCommandType, payload?: any): Promise<T>{
    const command: Command = {
      type: commandType,
      payload
    };

    this.submittedData = true;

    return this.uiLayer.execute<T>(command)
               .finally(() => this.submittedData = false );
  }

  private resetPanelState(){
    this.panelAddPhysicalRecordingState = false;
  }

}
