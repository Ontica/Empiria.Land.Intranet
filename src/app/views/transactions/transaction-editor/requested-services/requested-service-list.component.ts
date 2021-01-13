import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { RequestedService } from '@app/models';

@Component({
  selector: 'emp-land-requested-service-list',
  templateUrl: './requested-service-list.component.html',
  styles: [
  ]
})
export class RequestedServiceListComponent implements OnInit {

  @Input() requestedServices: RequestedService[] = [];

  dataSource: MatTableDataSource<RequestedService>;
  displayedColumns = ['number', 'type', 'baseGravable', 'cantidad', 'unidadMedida', 'fundamento', 'observations',
                      'recibo', 'Importe', 'action'];

  constructor() { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.requestedServices);
  }

  removeService(service){
    console.log(service);
  }

}
