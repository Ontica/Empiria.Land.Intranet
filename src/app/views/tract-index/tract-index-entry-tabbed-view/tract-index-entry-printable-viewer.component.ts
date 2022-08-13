/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { EmptyMediaBase, MediaBase, StringLibrary } from '@app/core';


@Component({
  selector: 'emp-land-tract-index-entry-printable-viewer',
  templateUrl: './tract-index-entry-printable-viewer.component.html',
})
export class TractIndexEntryPrintableViewerComponent implements OnChanges {

  @Input() documentID = '';

  @Input() stampMedia: MediaBase = EmptyMediaBase;

  displayStampMedia = false;

  stampMediaError = false;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.stampMedia) {
      this.resetStampMediaTab();
    }
  }


  onPrintStamp() {
    this.openStampMediaWindowToPrint();
  }


  onStampMediaError() {
    this.stampMediaError = true;
    console.log('Stamp Media Error: ', this.stampMedia);
  }


  private resetStampMediaTab() {
    this.displayStampMedia = false;
    this.stampMediaError = false;

    if (!!this.documentID && !!this.stampMedia.url) {
      setTimeout(() => this.displayStampMedia = true);
    }
  }


  private openStampMediaWindowToPrint() {
    if (StringLibrary.isValidHttpUrl(this.stampMedia.url || '')) {
      const width = 900;
      const height = 600;
      const top = Math.floor((screen.height / 2) - (height / 2));
      const left = Math.floor((screen.width / 2) - (width / 2));
      window.open(this.stampMedia.url, '_blank',
        `resizable=yes,width=${width},height=${height},top=${top},left=${left}`);
    }
  }

}
