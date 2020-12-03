import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { RecordingActParty } from '@app/domain/models';
import { Subscription } from 'rxjs';


@Component({
  selector: 'emp-land-parties-list',
  templateUrl: './parties-list.component.html',
})
export class PartiesListComponent implements OnInit {

  subscription: Subscription;
  dataSource: MatTableDataSource<RecordingActParty>;
  displayedColumns = ['name', 'typeIdentification', 'role', 'participationAmount', 'action'];

  constructor() { }

  ngOnInit(): void {
    this.initTable();
    this.loadPartiesData();
  }

  initTable(){
    this.dataSource = new MatTableDataSource([]);
  }

  loadPartiesData(){
    //TODO: subscribe to data
  }

  removeParty(party){
    //TODO: emite remove data
  }
}
