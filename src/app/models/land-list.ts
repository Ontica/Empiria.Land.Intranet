/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Entity } from "@app/core";

import { TransactionStage, TransactionStatus } from "./transaction";


export enum LandExplorerTypes {
  Transaction = 'Transaction',
  ESign       = 'ESign',
}


export interface LandEntity extends Entity {
  uid: string;
  requestedBy: string;
}


export interface LandQuery {
  stage?: string;
  status?: string;
  keywords: string;
}


export const EmptyLandQuery: LandQuery = {
  stage: TransactionStage.All,
  status: TransactionStatus.All,
  keywords: '',
};
