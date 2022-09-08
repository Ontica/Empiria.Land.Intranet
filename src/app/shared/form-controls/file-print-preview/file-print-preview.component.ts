/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { MediaType, StringLibrary } from '@app/core';

import { FileReport, FileType } from '@app/models';

import { UrlViewerService } from '@app/shared/services';


@Component({
  selector: 'emp-ng-file-print-preview',
  templateUrl: './file-print-preview.component.html',
  styleUrls: ['./file-print-preview.component.scss'],
})
export class FilePrintPreviewComponent implements OnChanges {

  @Input() title: string;

  @Input() hint: string;

  @Input() file: FileReport;

  display = false;

  url: string = null;

  fileError = false;

  constructor(private urlViewer: UrlViewerService){}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.file && !!this.file?.url) {
      this.open(this.file.url, this.file.type);
    }
  }


  open(url, type) {
    if (!StringLibrary.isValidHttpUrl(url)) {
      return;
    }

    if (type === MediaType.html || type === FileType.HTML) {
      this.urlViewer.openWindowCenter(url);
      return;
    }

    this.fileError = false;
    this.url = url;
    this.display = true;
  }


  onFileError() {
    this.fileError = true;
    console.log('File Error: ', this.url);
  }


  onClose() {
    this.url = null;
    this.display = false;
  }

}
