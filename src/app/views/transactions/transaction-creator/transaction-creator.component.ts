import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Transaction, EmptyTransaction } from '@app/models';


@Component({
  selector: 'emp-land-transaction-creator',
  templateUrl: './transaction-creator.component.html',
})
export class TransactionCreatorComponent implements OnInit {

  transaction: Transaction = EmptyTransaction;

  @Output() closeEvent = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  onClose() {
    this.closeEvent.emit();
  }

}
