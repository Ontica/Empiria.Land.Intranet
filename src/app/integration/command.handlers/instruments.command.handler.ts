/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Command, CommandHandler, toPromise } from '@app/core';

import { InstrumentsApiProvider } from '@app/domain/providers';


export enum CommandType {
  CREATE_INSTRUMENT = 'Land.Transaction.Instrument.Create',
  UPDATE_INSTRUMENT = 'Land.Transaction.Instrument.Update',
}


@Injectable()
export class InstrumentsCommandHandler extends CommandHandler {

  constructor(private service: InstrumentsApiProvider) {
    super(CommandType);
  }

  execute<U>(command: Command): Promise<U> {

    switch (command.type as CommandType) {

      case CommandType.CREATE_INSTRUMENT:
        return toPromise<U>(
          this.service.createTransactionInstrument(command.payload.transactionUID, command.payload.instrument)
        );

      case CommandType.UPDATE_INSTRUMENT:
        return toPromise<U>(
          this.service.updateTransactionInstrument(command.payload.transactionUID, command.payload.instrument)
        );

      default:
        throw this.unhandledCommand(command);
    }
  }

}
