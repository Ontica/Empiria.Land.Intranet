/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Command, CommandHandler, toPromise } from '@app/core';

import { TransactionDataService } from '@app/data-services';


export enum CommandType {
  CREATE_TRANSACTION = 'Lan.Transaction.Transaction.Create',
}


@Injectable()
export class TransactionCommandHandler extends CommandHandler {

  constructor(private data: TransactionDataService) {
    super(CommandType);
  }


  execute<U>(command: Command): Promise<U> {
    switch (command.type as CommandType) {

      // case CommandType.CREATE_TRANSACTION:
      //   return toPromise<U>(
      //     this.useCases.createRequest(command.payload.procedureType, command.payload.requestedBy)
      //   );

      default:
        throw this.unhandledCommand(command);
    }
  }

}
