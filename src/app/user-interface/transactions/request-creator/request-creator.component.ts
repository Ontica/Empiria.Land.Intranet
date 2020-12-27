/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Output, EventEmitter } from '@angular/core';

import { FrontController, Command } from '@app/core/presentation';

import { TransactionCommandType } from '@app/core/presentation/commands';

import { ProcedureType, Requester } from '@app/models';


@Component({
  selector: 'emp-land-request-creator',
  templateUrl: './request-creator.component.html',
  styleUrls: ['./request-creator.component.scss']
})
export class RequestCreatorComponent {

  @Output() closeEvent = new EventEmitter<void>();

  procedureType: ProcedureType = 'NoDeterminado';

  constructor(private frontController: FrontController) { }

  get procedureSelected() {
    return this.procedureType !== 'NoDeterminado';
  }

  onClose() {
    this.closeEvent.emit();
  }

  onRequesterDataChanged(requester: Requester) {
    this.sendCreateEFilingRequestEvent(requester);
  }


  private sendCreateEFilingRequestEvent(requestedBy: Requester) {
    const command: Command = {
      type: TransactionCommandType.CREATE_TRANSACTION,
      payload: {
        procedureType: this.procedureType,
        requestedBy
      }
    };

    console.log(command);
    this.closeEvent.emit();

    this.frontController.execute<void>(command)
                        .then(() => this.closeEvent.emit());

  }

}
