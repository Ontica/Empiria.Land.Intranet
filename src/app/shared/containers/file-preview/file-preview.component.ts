/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input } from '@angular/core';

import { MediaType } from '@app/core';

import { FileType } from '@app/models';


@Component({
  selector: 'emp-ng-file-preview',
  templateUrl: './file-preview.component.html',
  styleUrls: ['./file-preview.component.scss']
})
export class FilePreviewComponent {

  @Input() title: string;

  @Input() hint: string;

  fileUrl: string;

  fileType: string;

  hasError = false;

  displayInModal = false;


  open(url: string, type: string) {
    this.setFileData(url, type);

    if (!this.isValidUrl(this.fileUrl)) {
      console.log('Invalid URL: ', this.fileUrl);
      return;
    }

    if (this.canOpenWindow(this.fileType)) {
      this.openWindow(this.fileUrl);
      this.onClose();
      return;
    }

    this.openModal();
  }


  onFileError() {
    this.hasError = true;
  }


  onClose() {
    this.displayInModal = false;
  }


  private setFileData(url: string, type: string) {
    this.fileUrl = url;
    this.fileType = type;
  }


  private isValidUrl(url: string): boolean {
    return url !== null && url !== undefined && url !== '';
  }


  private canOpenWindow(type: string): boolean {
    return type === MediaType.html || type === FileType.HTML;
  }


  private openWindow(url: string, width: number = 1100, height: number = 600) {
    const top = Math.floor((screen.height / 2) - (height / 2));
    const left = Math.floor((screen.width / 2) - (width / 2));

    return window.open(url, '_blank',
      `resizable=yes,width=${width},height=${height},top=${top},left=${left}`);
  }


  private openModal() {
    this.hasError = false;
    this.displayInModal = true;
  }

}
