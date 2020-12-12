/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EmptyTransaction, Transaction } from '@app/domain/models';


@Component({
  selector: 'emp-land-recording-acts',
  templateUrl: './recording-acts-editor.component.html'
})
export class RecordingActsEditorComponent implements OnInit {

  @Input() request: Transaction = EmptyTransaction;

  @Output() closeEvent = new EventEmitter<void>();


  constructor() { }

  ngOnInit(): void {
  }

  onClose() {
    this.closeEvent.emit();
  }

  partyAdded(event){
  }
}
