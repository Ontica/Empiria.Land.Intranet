import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { EventInfo } from '@app/core';
import { TransactionShortModel } from '@app/models';

export enum TransactionListEditorEventType {
  FILTER_CHANGED = 'TransactionListEditorComponent.Event.FilterChanged',
}

@Component({
  selector: 'emp-land-transaction-list-editor',
  templateUrl: './transaction-list-editor.component.html',
})
export class TransactionListEditorComponent implements OnInit, OnChanges {

  @Input() transactionList: TransactionShortModel[] = [];

  @Input() canEdit: boolean = true;

  @Output() transactionListChange = new EventEmitter<TransactionShortModel[]>();

  @Output() transactionListEditorEvent = new EventEmitter<EventInfo>();

  listOptions = [{name: 'Remover trámite', value: 'RemoveTransaction', icon: 'close'}];

  searchUID = '';

  constructor() { }

  ngOnChanges(changes): void {
    if (changes.canEdit && !this.canEdit) {
      this.listOptions = [];
    }
  }

  ngOnInit(): void {
  }

  removeTransactionFromList(row: TransactionShortModel){
    this.transactionList = this.transactionList.filter(x => x.uid !== row.uid);
    this.transactionListChange.emit(this.transactionList);
  }

  onChangeFilter() {
    if (this.searchUID) {
      this.sendEvent(TransactionListEditorEventType.FILTER_CHANGED,
                    { searchUID: this.searchUID });

      this.searchUID = '';
    }
  }

  private sendEvent(eventType: TransactionListEditorEventType, payload?: any) {
    const event: EventInfo = {
      type: eventType,
      payload
    };

    this.transactionListEditorEvent.emit(event);
  }

}
