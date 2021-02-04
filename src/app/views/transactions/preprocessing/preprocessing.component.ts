import { Component, OnDestroy, OnInit } from '@angular/core';
import { EventInfo } from '@app/core';
import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';
import { TransactionAction } from '@app/core/presentation/presentation-types';
import { InstrumentFilesEditorEventType } from './instrument-files-editor/instrument-files-editor.component';

@Component({
  selector: 'emp-land-preprocessing',
  templateUrl: './preprocessing.component.html',
  styles: [
  ]
})
export class PreprocessingComponent implements OnInit, OnDestroy {

  helper: SubscriptionHelper;

  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
  }

  ngOnInit(): void {

  }

  ngOnDestroy() {
    this.uiLayer.dispatch(TransactionAction.UNSELECT_FILE);

    this.helper.destroy();
  }

  onInstrumentFilesEditorEvent(event: EventInfo): void {

    switch (event.type as InstrumentFilesEditorEventType) {

      case InstrumentFilesEditorEventType.SUBMIT_INSTRUMENT_FILE_CLICKED:

        console.log('SUBMIT_INSTRUMENT_FILE_CLICKED', event);

        return;

      case InstrumentFilesEditorEventType.DELETE_INSTRUMENT_FILE_CLICKED:

        console.log('DELETE_INSTRUMENT_FILE_CLICKED', event);

        return;

      case InstrumentFilesEditorEventType.SUBMIT_INSTRUMENT_ANNEX_FILE_CLICKED:

        console.log('SUBMIT_INSTRUMENT_ANNEX_FILE_CLICKED', event);

        return;

      case InstrumentFilesEditorEventType.DELETE_INSTRUMENT_ANNEX_FILE_CLICKED:

        console.log('DELETE_INSTRUMENT_ANNEX_FILE_CLICKED', event);

        return;

      case InstrumentFilesEditorEventType.SHOW_FILE_CLICKED:

        this.uiLayer.dispatch(TransactionAction.SELECT_FILE, {'file': event.payload});

        return;

      case InstrumentFilesEditorEventType.DOWNLOAD_FILE_CLICKED:

        console.log('DOWNLOAD_FILE_CLICKED', event);

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }

}
