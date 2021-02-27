/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */


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


export interface ApplicableCommand {
  type: WorkflowCommandType;
  name: string;
  nextStatus: WorkflowStatus[];
}


export interface WorkflowCommand {
  type: WorkflowCommandType;
  payload: WorkflowPayload;
}


export interface WorkflowPayload {
  searchUID?: string;
  transactionUID?: string[];
  nextStatus?: string;
  assignToUID?: string;
  authorization?: string;
  note?: string;
}


export const EmptyApplicableCommand: ApplicableCommand = {
  type: 'None',
  name: '',
  nextStatus: [],
};


export const EmptyWorkflowStatus: WorkflowStatus = {
  type: 'None',
  name: '',
  users: [],
};
