/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Output, EventEmitter } from '@angular/core';

import { EventInfo } from '@app/core';
import { FrontController } from '@app/core/presentation';
import { ProcedureType, Requester } from '@app/domain/models';
import { ElectronicFilingCommandType } from '@app/core/presentation/commands';

@Component({
  selector: 'emp-one-request-creator',
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
    const event: EventInfo = {
      type: ElectronicFilingCommandType.CREATE_EFILING_REQUEST,
      payload: {
        procedureType: this.procedureType,
        requestedBy
      }
    };

    this.frontController.dispatch<void>(event)
      .then(() => this.closeEvent.emit());

  }

}
