/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { InstrumentMediaContent } from '@app/models';

import { FileData, FileControlActions } from '@app/shared/form-controls/file-control/file-control-data';

import { FormatLibrary } from '@app/shared/utils';


export enum InstrumentFilesEditorEventType {
  SUBMIT_INSTRUMENT_FILE_CLICKED = 'InstrumentFilesEditorComponent.Event.SubmitInstrumentFileClicked',
  REMOVE_INSTRUMENT_FILE_CLICKED = 'InstrumentFilesEditorComponent.Event.RemoveInstrumentFileClicked',
  SHOW_FILE_CLICKED = 'InstrumentFilesEditorComponent.Event.ShowFileClicked',
  DOWNLOAD_FILE_CLICKED = 'InstrumentFilesEditorComponent.Event.DownloadFileClicked',
}


@Component({
  selector: 'emp-land-transaction-files-uploader',
  templateUrl: './transaction-files-uploader.component.html',
})
export class TransactionFilesUploaderComponent {

  @Input() instrumentMainFile: FileData;

  @Input() instrumentAuxiliaryFile: FileData;

  @Input() instrumentFileName: string = null;

  @Input() canEdit = false;

  @Output() instrumentFilesEditorEvent = new EventEmitter<EventInfo>();


  submitInstrumentFileEvent(event, mediaContent: InstrumentMediaContent) {

    let payload: any = {
      mediaContent,
      file: event.file,
      fileName: this.getFileNameByMediaContent(mediaContent)
    };

    switch (event.option as FileControlActions) {
      case 'SAVE':
        this.sendEvent(InstrumentFilesEditorEventType.SUBMIT_INSTRUMENT_FILE_CLICKED, payload);
        return;

      case 'REMOVE':
        payload = {
          mediaContent,
          mediaContentUID: event.file.uid
        };

        this.sendEvent(InstrumentFilesEditorEventType.REMOVE_INSTRUMENT_FILE_CLICKED, payload);
        return;

      case 'SHOW':
        this.sendEvent(InstrumentFilesEditorEventType.SHOW_FILE_CLICKED, event.file);
        return;

      case 'DOWNLOAD':
        this.sendEvent(InstrumentFilesEditorEventType.DOWNLOAD_FILE_CLICKED, payload);
        return;

      case 'CANCEL':
        console.log('CANCEL AUXILIARY', event.file);
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

  getFileNameByMediaContent(mediaContent: InstrumentMediaContent): string {
    if (this.instrumentFileName && this.instrumentFileName !== '') {
      if (mediaContent === 'InstrumentMainFile') {
        return this.instrumentFileName + '.pdf';
      }
      return 'Anexo de ' + FormatLibrary.firstLetterToLowerCase(this.instrumentFileName) + '.pdf';
    }
    return null;
  }

}
