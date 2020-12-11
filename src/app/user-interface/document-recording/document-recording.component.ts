import { Component, Input, OnInit } from '@angular/core';
import { EmptyTransaction, Transaction } from '@app/domain/models';

@Component({
  selector: 'emp-land-document-recording',
  templateUrl: './document-recording.component.html',
})
export class DocumentRecordingComponent implements OnInit {

  @Input() request: Transaction = EmptyTransaction;

  constructor() { }

  ngOnInit(): void {
  }

}
