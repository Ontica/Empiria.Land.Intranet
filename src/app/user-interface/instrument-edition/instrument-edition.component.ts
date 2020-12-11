import { Component, Input, OnInit } from '@angular/core';
import { EmptyTransaction, Transaction } from '@app/domain/models';

@Component({
  selector: 'emp-land-instrument-edition',
  templateUrl: './instrument-edition.component.html',
})
export class InstrumentEditionComponent implements OnInit {

  @Input() request: Transaction = EmptyTransaction;

  constructor() { }

  ngOnInit(): void {
  }

}
