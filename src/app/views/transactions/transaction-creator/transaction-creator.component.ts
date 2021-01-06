import { Component, EventEmitter, OnInit, Output } from '@angular/core';


@Component({
  selector: 'emp-land-transaction-creator',
  templateUrl: './transaction-creator.component.html',
})
export class TransactionCreatorComponent implements OnInit {

  @Output() closeEvent = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  onClose() {
    this.closeEvent.emit();
  }

}
