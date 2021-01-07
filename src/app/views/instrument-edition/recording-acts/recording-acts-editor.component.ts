/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Transaction, EmptyTransaction } from '@app/models';


@Component({
  selector: 'emp-land-recording-acts',
  templateUrl: './recording-acts-editor.component.html'
})
export class RecordingActsEditorComponent {

  @Input() transaction: Transaction = EmptyTransaction;

  @Output() closeEvent = new EventEmitter<void>();

  onClose() {
    this.closeEvent.emit();
  }

  partyAdded(event) {

  }

}
