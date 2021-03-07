/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Transaction, EmptyTransaction } from '@app/models';


@Component({
  selector: 'emp-land-recording-act-data-editor',
  templateUrl: './recording-act-data-editor.component.html'
})
export class RecordingActDataEditorComponent {

  @Input() transaction: Transaction = EmptyTransaction;

  @Output() closeEvent = new EventEmitter<void>();

  onClose() {
    this.closeEvent.emit();
  }

  partyAdded(event) {

  }

}
