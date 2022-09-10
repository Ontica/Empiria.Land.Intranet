/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { EmptyMediaBase, MediaBase } from '@app/core';

import { UrlViewerService } from '@app/shared/services';


@Component({
  selector: 'emp-land-tract-index-entry-printable-viewer',
  templateUrl: './tract-index-entry-printable-viewer.component.html',
})
export class TractIndexEntryPrintableViewerComponent implements OnChanges {

  @Input() documentID = '';

  @Input() stampMedia: MediaBase = EmptyMediaBase;

  displayStampMedia = false;

  stampMediaError = false;


  constructor(private urlViewer: UrlViewerService){}


  ngOnChanges(changes: SimpleChanges) {
    if (changes.stampMedia) {
      this.resetStampMediaTab();
    }
  }


  onPrintStamp() {
    this.urlViewer.openWindowCentered(this.stampMedia.url);
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

}
