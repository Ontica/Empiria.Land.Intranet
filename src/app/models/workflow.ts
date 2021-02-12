import { DateString } from '@app/core';


export interface WorkflowTask {
  taskName: string;
  assigneeName: string;
  checkInTime: DateString;
  checkOutTime: DateString;
  endProcessTime: DateString;
  elapsedTime: string;
  nextTask: string;
  nextTaskName: string;
  nextAssigneeUID: string;
  nextAssigneeName: string;
  notes: string;
  statusName: string;
}
