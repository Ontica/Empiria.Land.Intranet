import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { EmptyTransaction, Transaction } from '@app/domain/models';
import { PartyEditorComponent } from './party-editor/party-editor.component';


@Component({
  selector: 'emp-land-recording-acts',
  templateUrl: './recording-acts.component.html'
})
export class RecordingActsComponent implements OnInit {
  @ViewChild(PartyEditorComponent) partyEditor: PartyEditorComponent;

  @Input() request: Transaction = EmptyTransaction;

  @Output() closeEvent = new EventEmitter<void>();


  constructor() { }

  ngOnInit(): void {
  }

  partyAdded(event){
  }

  onClose() {
    this.closeEvent.emit();
  }

  onScroll(scroll){
    this.partyEditor.closeSelects();
  }

}
