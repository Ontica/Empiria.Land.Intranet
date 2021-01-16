import { CurrencyPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { RequestedService } from '@app/models';
import { MessageBoxService } from '@app/shared/containers/message-box';

@Component({
  selector: 'emp-land-requested-service-list',
  templateUrl: './requested-service-list.component.html',
  styles: [
  ]
})
export class RequestedServiceListComponent implements OnInit {

  @Input() requestedServices: RequestedService[] = [];

  dataSource: MatTableDataSource<RequestedService>;
  displayedColumns = ['number', 'typeName', 'taxableBase', 'quantity', 'unitName',
                      'legalBasis', 'notes', 'treasuryCode', 'subtotal', 'action'];

  constructor(private messageBox: MessageBoxService,
              private currencyPipe: CurrencyPipe) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.requestedServices);
  }

  removeService(service: RequestedService){
    const message = `Esta operación eliminará el concepto
      <strong>${service.typeName}</strong> con importe de
      <strong>${this.currencyPipe.transform(service.subtotal)}</strong>.
      <br><br>¿Desea eliminar el concepto?`;

    this.messageBox.confirm(message, 'Eliminar Concepto', 'DeleteCancel')
        .toPromise()
        .then(x => {
          if (x) {
            console.log(service);
          }
        });
  }

}
