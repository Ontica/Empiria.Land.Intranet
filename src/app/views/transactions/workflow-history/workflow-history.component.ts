import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DateStringLibrary } from '@app/core';
import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';
import { TransactionStateSelector } from '@app/core/presentation/presentation-types';
import { WorkflowTask } from '@app/models';

@Component({
  selector: 'emp-land-workflow-history',
  templateUrl: './workflow-history.component.html',

})
export class WorkflowHistoryComponent implements OnInit, OnChanges, OnDestroy {

  @Input() transactionUID: string = 'Empty';

  helper: SubscriptionHelper;

  listWorkflowTask: WorkflowTask[] = [];
  dataSource: MatTableDataSource<WorkflowTask>;
  displayedColumns = ['taskName', 'assigneeName', 'checkInTime', 'checkOutTime', 'endProcessTime',
                      'elapsedTime', 'statusName', 'notes'];
  displayedFooterColumns = ['footerElapsedTime', 'footerNotes'];

  elapsedTimeTotal: string = '';
  elapsedTimeTotal2: string = '';

  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
  }

  ngOnInit(): void {
  }

  ngOnChanges(){
    this.helper.select<WorkflowTask[]>(TransactionStateSelector.SELECTED_WORKFLOW_HISTORY,
                                       this.transactionUID)
      .subscribe(x => {
        this.listWorkflowTask = x;
        this.setData();
      });
  }

  ngOnDestroy() {
    this.helper.destroy();
  }

  setData(){
    this.dataSource = new MatTableDataSource(this.listWorkflowTask);
    this.setElapsedTimeTotal();
  }

  setElapsedTimeTotal(){
    this.elapsedTimeTotal = this.listWorkflowTask
                              .filter(x => x.checkInTime !== x.endProcessTime)
                              .map(x => x.elapsedTime)
                              .reduce((a, c) => DateStringLibrary.addTimes(a, c), '00:00:00:00');
  }

}
