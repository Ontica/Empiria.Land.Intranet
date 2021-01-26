import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { EventInfo } from '@app/core';
import { RequestedService } from '@app/models';
import { MessageBoxService } from '@app/shared/containers/message-box';


export enum RequestedServiceListEventType {
  DELETE_REQUESTED_SERVICE_CLICKED  = 'RequestedServiceListComponent.Event.DeleteRequestedServiceClicked',
}

@Component({
  selector: 'emp-land-requested-service-list',
  templateUrl: './requested-service-list.component.html',
  styles: [
  ]
})
export class RequestedServiceListComponent implements OnInit, OnChanges {

  @Input() requestedServices: RequestedService[] = [];

  @Input() canDelete: boolean = true;

  @Output() requestedServiceListEvent = new EventEmitter<EventInfo>();

  dataSource: MatTableDataSource<RequestedService>;
  private displayedColumnsDefault = ['number', 'typeName', 'taxableBase', 'quantity', 'unitName',
                                     'legalBasis', 'notes', 'treasuryCode', 'subtotal'];
  displayedColumns = [...this.displayedColumnsDefault];

  constructor(private messageBox: MessageBoxService,
              private currencyPipe: CurrencyPipe) { }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges){
    if (changes.requestedServices){
      this.dataSource = new MatTableDataSource(this.requestedServices);
    }

    this.resetColumns();
  }

  resetColumns(){
    this.displayedColumns = [...this.displayedColumnsDefault];

    if (this.canDelete){
      this.displayedColumns.push('action');
    }
  }

  removeService(service: RequestedService){
    const message = `Esta operación eliminará el concepto
      <strong>${service.typeName}</strong> con importe de
      <strong>${this.currencyPipe.transform(service.subtotal)}</strong>.
      <br><br>¿Elimino el concepto?`;

    this.messageBox.confirm(message, 'Eliminar concepto', 'DeleteCancel')
        .toPromise()
        .then(x => {
          if (x) {
            this.sendEvent(RequestedServiceListEventType.DELETE_REQUESTED_SERVICE_CLICKED,
                           service.uid);
          }
        });
  }

  private sendEvent(eventType: RequestedServiceListEventType, payload?: any) {
    const event: EventInfo = {
      type: eventType,
      payload
    };

    this.requestedServiceListEvent.emit(event);
  }

}
