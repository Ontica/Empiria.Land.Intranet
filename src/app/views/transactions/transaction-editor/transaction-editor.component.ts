import { Component, OnInit, OnDestroy } from '@angular/core';
import { Command, EventInfo, isEmpty } from '@app/core';
import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';
import { TransactionCommandType, TransactionStateSelector } from '@app/core/presentation/presentation-types';
import { Transaction, EmptyTransaction, TransactionType, Agency, RecorderOffice, insertToArrayIfNotExist,
         ProvidedServiceType } from '@app/models';
import { TransactionHeaderEventType } from '../transaction-header/transaction-header.component';
import { RequestedServiceEditortEventType } from './requested-services/requested-service-editor.component';

@Component({
  selector: 'emp-land-transaction-editor',
  templateUrl: './transaction-editor.component.html',
})
export class TransactionEditorComponent implements OnInit, OnDestroy {

  transaction: Transaction = EmptyTransaction;

  transactionTypeList: TransactionType[] = [];

  agencyList: Agency[] = [];

  recorderOfficeList: RecorderOffice[] = [];

  providedServiceTypeList: ProvidedServiceType[] = [];

  helper: SubscriptionHelper;

  panelAddServiceOpenState: boolean = false;

  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
  }

  ngOnInit() {
    this.helper.select<Transaction>(TransactionStateSelector.SELECTED_TRANSACTION)
      .subscribe(x => {
        this.transaction = x;
        this.panelAddServiceOpenState = false;
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

    this.helper.select<ProvidedServiceType[]>(TransactionStateSelector.PROVIDED_SERVICE_LIST, {})
      .subscribe(x => {
        this.providedServiceTypeList = x;
      });
  }

  onTransactionHeaderEvent(event: EventInfo): void {

    switch (event.type as TransactionHeaderEventType) {

      case TransactionHeaderEventType.SUBMIT_TRANSACTION_CLICKED:

        this.executeCommand(TransactionCommandType.UPDATE_TRANSACTION, event.payload);

        return;

      case TransactionHeaderEventType.CLONE_TRANSACTION_CLICKED:

        this.executeCommand(TransactionCommandType.CLONE_TRANSACTION);

        return;

      case TransactionHeaderEventType.DELETE_TRANSACTION_CLICKED:

        this.executeCommand(TransactionCommandType.DELETE_TRANSACTION);

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }

  onRequestedServiceEditortEvent(event: EventInfo): void {

    switch (event.type as RequestedServiceEditortEventType) {

      case RequestedServiceEditortEventType.SUBMIT_REQUESTED_SERVICE_CLICKED:

        console.table(event);

        setTimeout(() => {
          this.panelAddServiceOpenState = false;
        }, 500);

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }

  executeCommand(commandType: TransactionCommandType, transaction?: Transaction){
    const command: Command = {
      type: commandType,
      payload: {
        transactionUID: this.transaction.uid,
        transaction
      }
    };

    this.uiLayer.execute(command);
    return;
  }

}
