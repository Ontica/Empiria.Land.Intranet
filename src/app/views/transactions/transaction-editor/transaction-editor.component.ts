import { Component, OnInit, OnDestroy } from '@angular/core';
import { Command, EventInfo, isEmpty } from '@app/core';
import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';
import { TransactionCommandType, TransactionStateSelector } from '@app/core/presentation/presentation-types';
import { Transaction, EmptyTransaction, TransactionType, Agency, RecorderOffice,
         insertToArrayIfNotExist } from '@app/models';
import { TransactionHeaderEventType } from '../transaction-header/transaction-header.component';

@Component({
  selector: 'emp-land-transaction-editor',
  templateUrl: './transaction-editor.component.html',
})
export class TransactionEditorComponent implements OnInit, OnDestroy {

  transaction: Transaction = EmptyTransaction;

  transactionTypeList: TransactionType[] = [];

  agencyList: Agency[] = [];

  recorderOfficeList: RecorderOffice[] = [];

  helper: SubscriptionHelper;

  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
  }

  ngOnInit() {
    this.helper.select<Transaction>(TransactionStateSelector.SELECTED_TRANSACTION)
      .subscribe(x => {
        this.transaction = x;
        this.loadDataLists();
      });
  }

  ngOnDestroy() {
    this.helper.destroy();
  }

  loadDataLists(){
    this.helper.select<TransactionType[]>(TransactionStateSelector.TRANSACTION_TYPE_LIST, {})
      .subscribe(x => {
        this.transactionTypeList = x;
      });

    this.helper.select<RecorderOffice[]>(TransactionStateSelector.RECORDER_OFFICE_LIST, {})
      .subscribe(x => {
        this.recorderOfficeList = isEmpty(this.transaction.recorderOffice) ?
                                  x : insertToArrayIfNotExist(x, this.transaction.recorderOffice, 'uid');
      });

    this.helper.select<Agency[]>(TransactionStateSelector.AGENCY_LIST, {})
      .subscribe(x => {
        this.agencyList = isEmpty(this.transaction.agency) ?
                          x : insertToArrayIfNotExist(x, this.transaction.agency, 'uid');
      });
  }

  onTransactionHeaderEvent(event: EventInfo): void {
    switch (event.type as TransactionHeaderEventType) {

      case TransactionHeaderEventType.SUBMIT_TRANSACTION_CLICKED:

        const command: Command = {
          type: TransactionCommandType.UPDATE_TRANSACTION,
          payload: {
            transactionUID: this.transaction.uid,
            transaction: event.payload
          }
        };

        this.uiLayer.execute(command);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }

}
