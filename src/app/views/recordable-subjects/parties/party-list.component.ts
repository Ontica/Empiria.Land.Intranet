/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { RecordingActParty } from '@app/models';


@Component({
  selector: 'emp-land-party-list',
  templateUrl: './party-list.component.html',
})
export class PartyListComponent implements OnInit {

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
    // TODO: subscribe to data
  }

  removeParty(party){
    // TODO: emite remove data
  }
}
