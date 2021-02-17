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
                                  'ReturnToMe' | 'SetNextStatus' | 'Sign' | 'Unsign';


export interface Collection {
  type: string;
  name: string;
}


export interface Operation {
  type: WorkflowCommandType;
  name: string;
  nextStatus: Collection[];
  nextUsers: Identifiable[];
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


export const EmptyOperation: Operation = {
  type: null,
  name: '',
  nextStatus: [],
  nextUsers: [],
};
