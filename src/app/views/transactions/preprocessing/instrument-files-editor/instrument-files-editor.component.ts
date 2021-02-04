import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { EventInfo } from '@app/core';
import { FileData, FileControlActions } from '@app/shared/form-controls/file-control/file-control';
import { FormatLibrary } from '@app/shared/utils';

export enum InstrumentFilesEditorEventType {
  SUBMIT_INSTRUMENT_FILE_CLICKED  = 'InstrumentFilesEditorComponent.Event.SubmitInstrumentFileClicked',
  DELETE_INSTRUMENT_FILE_CLICKED  = 'InstrumentFilesEditorComponent.Event.DeleteInstrumentFileClicked',
  SUBMIT_INSTRUMENT_ANNEX_FILE_CLICKED  = 'InstrumentFilesEditorComponent.Event.SubmitInstrumentAnnexFileClicked',
  DELETE_INSTRUMENT_ANNEX_FILE_CLICKED  = 'InstrumentFilesEditorComponent.Event.DeleteInstrumentAnnexFileClicked',
  SHOW_FILE_CLICKED  = 'InstrumentFilesEditorComponent.Event.ShowFileClicked',
  DOWNLOAD_FILE_CLICKED  = 'InstrumentFilesEditorComponent.Event.DownloadFileClicked',
}

@Component({
  selector: 'emp-land-instrument-files-editor',
  templateUrl: './instrument-files-editor.component.html',
  styles: [
  ]
})
export class InstrumentFilesEditorComponent implements OnInit, OnChanges {

  @Input() instrumentDescriptor: string = null;

  @Input() instrumentFile: FileData = null;

  @Input() instrumentAnnexFile: FileData = null;

  @Output() instrumentFilesEditorEvent = new EventEmitter<EventInfo>();

  constructor() { }

  ngOnInit(): void {}

  ngOnChanges(){}

  getAnnexFileName(){
    if (this.instrumentDescriptor && this.instrumentDescriptor !== '' ){
      return 'Anexo de ' + FormatLibrary.firstLetterToLowerCase(this.instrumentDescriptor);
    }
    return null;
  }

  submitInstrumentFileEvent(event){
    switch (event.option as FileControlActions) {
      case 'SAVE':
        this.sendEvent(InstrumentFilesEditorEventType.SUBMIT_INSTRUMENT_FILE_CLICKED, event.file);
        return;

      case 'DELETE':
        this.sendEvent(InstrumentFilesEditorEventType.DELETE_INSTRUMENT_FILE_CLICKED, event.file);
        return;

      case 'SHOW':
        this.sendEvent(InstrumentFilesEditorEventType.SHOW_FILE_CLICKED, event.file);
        return;

      case 'DOWNLOAD':
        this.sendEvent(InstrumentFilesEditorEventType.DOWNLOAD_FILE_CLICKED, event.file);
        return;

      case 'CANCEL':
        console.log('CANCEL INSTRUMENT', event.file);

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }

  submitInstrumentAnnexFileEvent(event){
    switch (event.option as FileControlActions) {
      case 'SAVE':
        this.sendEvent(InstrumentFilesEditorEventType.SUBMIT_INSTRUMENT_ANNEX_FILE_CLICKED, event.file);
        return;

      case 'DELETE':
        this.sendEvent(InstrumentFilesEditorEventType.DELETE_INSTRUMENT_ANNEX_FILE_CLICKED, event.file);
        return;

      case 'SHOW':
        this.sendEvent(InstrumentFilesEditorEventType.SHOW_FILE_CLICKED, event.file);
        return;

      case 'DOWNLOAD':
        this.sendEvent(InstrumentFilesEditorEventType.DOWNLOAD_FILE_CLICKED, event.file);
        return;

      case 'CANCEL':
        console.log('CANCEL ANNEX', event.file);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }

  private sendEvent(eventType: InstrumentFilesEditorEventType, payload?: any) {
    const event: EventInfo = {
      type: eventType,
      payload
    };

    this.instrumentFilesEditorEvent.emit(event);
  }

}
