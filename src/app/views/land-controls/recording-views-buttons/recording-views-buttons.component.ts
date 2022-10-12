/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input } from '@angular/core';

import { EmptyMediaBase, MediaBase } from '@app/core';

import { UrlViewerService } from '@app/shared/services';

@Component({
  selector: 'emp-land-recording-views-buttons',
  templateUrl: './recording-views-buttons.component.html',
})
export class RecordingViewsButtonsComponent {

  @Input() recordingMedia: MediaBase = EmptyMediaBase;


  constructor(private urlViewer: UrlViewerService) {

  }


  onRecordingMediaClicked() {
    if (!this.recordingMedia.url) {
      return;
    }

    this.urlViewer.openWindowCentered(this.recordingMedia.url);
  }

}
