/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input } from '@angular/core';

@Component({
  selector: 'emp-land-recording-views-buttons',
  templateUrl: './recording-views-buttons.component.html',
})
export class RecordingViewsButtonsComponent {

  @Input() recordingMedia;

  @Input() stampMedia;

  onRecordingMediaClicked() {
    console.log('Recording Media Clicked: ', this.recordingMedia);
  }


  onStampMediaClicked() {
    console.log('Stamp Media Clicked: ', this.stampMedia);
  }

}
