/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, QueryList, SimpleChanges,
         ViewChildren } from '@angular/core';

import { EventInfo } from '@app/core';

import { InstrumentMediaContent, mapToFileDataFromMediaFile, MediaFile } from '@app/models';

import { FileData, FileControlActions } from '@app/shared/form-controls/file-control/file-control-data';

import { FileControlComponent } from '@app/shared/form-controls/file-control/file-control.component';

import { sendEvent } from '@app/shared/utils';


export enum TransactionFilesEventType {
  UPLOAD_FILE_CLICKED = 'TransactionFilesComponent.Event.UploadFileClicked',
  REMOVE_FILE_CLICKED = 'TransactionFilesComponent.Event.RemoveFileClicked',
  SHOW_FILE_CLICKED   = 'TransactionFilesComponent.Event.ShowFileClicked',
}


@Component({
  selector: 'emp-land-transaction-files',
  templateUrl: './transaction-files.component.html',
})
export class TransactionFilesComponent implements OnChanges {

  @ViewChildren(FileControlComponent) fileControls: QueryList<FileControlComponent>;

  @Input() transactionUID = '';

  @Input() mediaFiles: MediaFile[] = [];

  @Input() canEdit = false;

  @Input() readonly = false;

  @Output() transactionFilesEvent = new EventEmitter<EventInfo>();

  mainFile: FileData;

  auxiliaryFile: FileData;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.mediaFiles) {
      this.resetFileControls();
      this.mapFileDataFromMediaFile();
    }
  }


  onFileControlEvent(event, mediaContent: InstrumentMediaContent) {
    switch (event.option as FileControlActions) {
      case 'SAVE':
        sendEvent(this.transactionFilesEvent, TransactionFilesEventType.UPLOAD_FILE_CLICKED,
          { transactionUID: this.transactionUID, mediaContent, file: event.file.file });
        return;

      case 'REMOVE':
        sendEvent(this.transactionFilesEvent, TransactionFilesEventType.REMOVE_FILE_CLICKED,
          { transactionUID: this.transactionUID, mediaContent, mediaFileUID: event.file.uid });
        return;

      case 'SHOW':
        sendEvent(this.transactionFilesEvent, TransactionFilesEventType.SHOW_FILE_CLICKED,
          { file: event.file });
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private resetFileControls() {
    if(!!this.fileControls) {
      this.fileControls.forEach((item: FileControlComponent) => item.resetFileControl())
    }
  }


  private mapFileDataFromMediaFile() {
    this.mainFile = this.getMediaFileByContent(this.mediaFiles, 'InstrumentMainFile');
    this.auxiliaryFile = this.getMediaFileByContent(this.mediaFiles, 'InstrumentAuxiliaryFile');
  }


  private getMediaFileByContent(mediaFiles: MediaFile[], mediaContent: InstrumentMediaContent): FileData {
    const mediaFile: MediaFile = mediaFiles.find(file => file.content === mediaContent);
    return !!mediaFile ? mapToFileDataFromMediaFile(mediaFile) : null;
  }

}
