import { DateString, Identifiable } from '@app/core';


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


export type WorkflowCommandType = 'AssignTo' | 'PullToControlDesk' | 'Receive' | 'Reentry' |
                                  'ReturnToMe' | 'SetNextStatus' | 'Sign' | 'Unsign' | 'None';


export interface WorkflowStatus {
  type: string;
  name: string;
  users: Identifiable[];
}


export interface WorkflowOperation {
  type: WorkflowCommandType;
  name: string;
  nextStatus: WorkflowStatus[];
}


export interface WorkflowCommand {
  type: WorkflowCommandType;
  payload: WorkflowPayload;
}


export interface WorkflowPayload {
  transactionUID: string[];
  nextStatus: string;
  assignToUID: string;
  authorization: string;
  note: string;
}


export const EmptyOperation: WorkflowOperation = {
  type: 'None',
  name: '',
  nextStatus: [],
};


export const EmptyWorkflowStatus: WorkflowStatus = {
  type: 'None',
  name: '',
  users: [],
};
