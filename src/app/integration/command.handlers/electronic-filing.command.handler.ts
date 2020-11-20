/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Command, CommandHandler, toPromise } from '@app/core';

import { ElectronicFilingUseCases } from '@app/domain/use-cases';


export enum CommandType {
  CREATE_EFILING_REQUEST = 'OnePoint.ElectronicFiling.EFilingRequest.Create',
  DELETE_EFILING_REQUEST = 'OnePoint.ElectronicFiling.EFilingRequest.Delete',
  UPDATE_EFILING_REQUEST = 'OnePoint.ElectronicFiling.EFilingRequest.Update',
  UPDATE_APPLICATION_FORM = 'OnePoint.ElectronicFiling.ApplicationForm.Update',
  SET_PAYMENT_RECEIPT = 'OnePoint.ElectronicFiling.EFilingRequest.SetPaymentReceipt',
  SIGN = 'OnePoint.ElectronicFiling.EFilingRequest.Sign',
  REVOKE_SIGN = 'OnePoint.ElectronicFiling.EFilingRequest.RevokeSign',
  GENERATE_PAYMENT_ORDER = 'OnePoint.ElectronicFiling.EFilingRequest.GeneratePaymentOrder',
  REQUEST_SUBMISSION = 'OnePoint.ElectronicFiling.EFilingRequest.Submit'
}


@Injectable()
export class ElectronicFilingCommandHandler extends CommandHandler {

  constructor(private useCases: ElectronicFilingUseCases) {
    super(CommandType);
  }


  execute<U>(command: Command): Promise<U> {
    switch (command.type as CommandType) {

      case CommandType.CREATE_EFILING_REQUEST:
        return toPromise<U>(
          this.useCases.createRequest(command.payload.procedureType, command.payload.requestedBy)
        );

      case CommandType.DELETE_EFILING_REQUEST:
        return toPromise<U>(
          this.useCases.deleteRequest(command.payload.request)
        );

      case CommandType.UPDATE_EFILING_REQUEST:
        return toPromise<U>(
          this.useCases.updateRequest(command.payload.request, command.payload.requestedBy)
        );

      case CommandType.UPDATE_APPLICATION_FORM:
        return toPromise<U>(
          this.useCases.updateApplicationForm(command.payload.request, command.payload.form)
        );

      case CommandType.SET_PAYMENT_RECEIPT:
        return toPromise<U>(
          this.useCases.setPaymentReceipt(command.payload.request, command.payload.receiptNo)
        );


      case CommandType.SIGN:
        return toPromise<U>(
          this.useCases.signRequest(command.payload.request, command.payload.token)
        );

      case CommandType.REVOKE_SIGN:
        return toPromise<U>(
          this.useCases.revokeRequestSign(command.payload.request, command.payload.token)
        );

      case CommandType.GENERATE_PAYMENT_ORDER:
        return toPromise<U>(
          this.useCases.generatePaymentOrder(command.payload.request)
        );

      case CommandType.REQUEST_SUBMISSION:
        return toPromise<U>(
          this.useCases.submitRequest(command.payload.request)
        );

      default:
        throw this.unhandledCommand(command);
    }
  }

}
