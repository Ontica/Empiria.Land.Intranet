import { Component, OnInit, OnDestroy } from '@angular/core';
import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';
import { TransactionStateSelector } from '@app/core/presentation/presentation-types';
import { EmptyTransaction, Transaction } from '@app/models';

@Component({
  selector: 'emp-land-transaction-editor',
  templateUrl: './transaction-editor.component.html',
})
export class TransactionEditorComponent implements OnInit, OnDestroy {

  transaction: Transaction = EmptyTransaction;

  helper: SubscriptionHelper;

  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
  }

  ngOnInit() {
    this.helper.select<Transaction>(TransactionStateSelector.SELECTED_TRANSACTION)
      .subscribe(x => this.transaction = x);
  }

  ngOnDestroy() {
    this.helper.destroy();
  }

}
