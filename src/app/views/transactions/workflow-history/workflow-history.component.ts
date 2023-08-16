/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { DateStringLibrary } from '@app/core';

import { MatTableDataSource } from '@angular/material/table';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { TransactionStateSelector } from '@app/core/presentation/presentation-types';

import { WorkflowTask } from '@app/models';


@Component({
  selector: 'emp-land-workflow-history',
  templateUrl: './workflow-history.component.html',
})
export class WorkflowHistoryComponent implements OnInit, OnDestroy {

  @Input() transactionUID = 'Empty';

  helper: SubscriptionHelper;

  dataSource: MatTableDataSource<WorkflowTask>;

  displayedColumns = ['taskName', 'assigneeName', 'checkInTime', 'checkOutTime', 'endProcessTime',
                      'elapsedTime', 'statusName', 'notes'];

  displayedFooterColumns = ['footerElapsedTime', 'footerNotes'];

  elapsedTimeTotal = '';

  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit() {
    this.helper.select<WorkflowTask[]>(TransactionStateSelector.SELECTED_WORKFLOW_HISTORY, this.transactionUID)
      .subscribe(x => this.setData(x ?? []));
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  private setData(data: WorkflowTask[]) {
    this.dataSource = new MatTableDataSource(data);
    this.setElapsedTimeTotal(data);
  }


  private setElapsedTimeTotal(data: WorkflowTask[]) {
    this.elapsedTimeTotal = data
      .filter(x => x.checkInTime !== x.endProcessTime)
      .map(x => x.elapsedTime)
      .reduce((a, c) => DateStringLibrary.addTimes(a, c), '00:00:00:00');
  }

}
