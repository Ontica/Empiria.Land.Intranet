import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Command, EventInfo } from '@app/core';
import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';
import { TransactionCommandType, TransactionStateSelector } from '@app/core/presentation/presentation-types';
import { Transaction, EmptyTransaction, TransactionType, Agency, RecorderOffice } from '@app/models';
import { TransactionHeaderEventType } from '../transaction-header/transaction-header.component';


@Component({
  selector: 'emp-land-transaction-creator',
  templateUrl: './transaction-creator.component.html',
})
export class TransactionCreatorComponent implements OnInit, OnDestroy {

  @Output() closeEvent = new EventEmitter<void>();

  transaction: Transaction = EmptyTransaction;

  transactionTypeList: TransactionType[] = [];

  agencyList: Agency[] = [];

  recorderOfficeList: RecorderOffice[] = [];

  helper: SubscriptionHelper;

  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
  }

  ngOnInit(): void {
    this.helper.select<TransactionType[]>(TransactionStateSelector.TRANSACTION_TYPE_LIST, {})
      .subscribe(x => {
        this.transactionTypeList = x;
      });

    this.helper.select<RecorderOffice[]>(TransactionStateSelector.RECORDER_OFFICE_LIST, {})
      .subscribe(x => {
        this.recorderOfficeList = x;
      });

    this.helper.select<Agency[]>(TransactionStateSelector.AGENCY_LIST, {})
      .subscribe(x => {
        this.agencyList = x;
      });
  }

  ngOnDestroy() {
    this.helper.destroy();
  }

  onTransactionHeaderEvent(event: EventInfo): void {
    switch (event.type as TransactionHeaderEventType) {

      case TransactionHeaderEventType.SUBMIT_TRANSACTION_CLICKED:

        const command: Command = {
          type: TransactionCommandType.CREATE_TRANSACTION,
          payload: {
            transactionUID: '',
            transaction: event.payload
          }
        };

        this.uiLayer.execute<Transaction>(command)
          .then(x => this.onClose());

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }

  onClose() {
    this.closeEvent.emit();
  }

}
