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


export type OperationType = 'AssignTo' | 'PullToControlDesk' | 'Receive' | 'Reentry' |
                            'ReturnToMe' | 'SetNextStatus' | 'Sign' | 'Unsign';


export interface Collection {
  type: string;
  name: string;
}


export interface Operation {
  type: OperationType;
  name: string;
  nextStatus: Collection[];
  nextUsers: Identifiable[];
}


export const EmptyOperation: Operation = {
  type: null,
  name: '',
  nextStatus: [],
  nextUsers: [],
};
