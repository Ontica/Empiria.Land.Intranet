/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Entity } from "@app/core";

import { TransactionStage, TransactionStatus } from "./transaction";


export enum LandExplorerTypes {
  Transaction = 'Transaction',
  ESign       = 'ESign',
}


export interface LandEntity extends Entity {
  uid: string;
  requestedBy: string;
  registrationTime: DateString;
}


export interface LandQuery {
  recorderOfficeUID: string;
  stage?: string;
  status?: string;
  keywords: string;
}


export const EmptyLandQuery: LandQuery = {
  recorderOfficeUID: '',
  stage: TransactionStage.All,
  status: TransactionStatus.All,
  keywords: '',
};
