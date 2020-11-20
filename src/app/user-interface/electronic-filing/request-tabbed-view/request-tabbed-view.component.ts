/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';

import { EventInfo } from '@app/core';
import { FrontController } from '@app/core/presentation';

import { EFilingRequest, EmptyEFilingRequest, Requester } from '@app/domain/models';
import { ElectronicFilingCommandType } from '@app/core/presentation/commands';


@Component({
  selector: 'emp-one-request-tabbed-view',
  templateUrl: './request-tabbed-view.component.html'
})
export class RequestTabbedViewComponent implements OnChanges {

  @Input() request: EFilingRequest = EmptyEFilingRequest;

  @Output() closeEvent = new EventEmitter<void>();

  selectedStepperIndex = 0;

  constructor(private frontController: FrontController) { }


  ngOnChanges() {
    this.setSelectedStepperIndex();
  }


  get formFilled(): boolean {
    return (this.request?.form?.fields !== null);
  }


  get signed(): boolean {
    return (this.request?.esign?.sign !== null);
  }


  get isSigner(): boolean {
    return false;
  }


  get submitted(): boolean {
    return (this.request.transaction?.presentationDate !== null);
  }


  onClose() {
    this.closeEvent.emit();
  }


  onRequesterDataChanged(requester: Requester) {
    this.sendCreateEFilingRequestEvent(requester);
  }


  processEvent(event: EventInfo) {
    this.frontController.dispatch<void>(event)
        .catch(err => alert(err.error.response.data.errorMessage ||
                            'Ocurrió un problema: \n\n' + JSON.stringify(err))
        );
  }


  // Private methods

  private sendCreateEFilingRequestEvent(requestedBy: Requester) {
    const event: EventInfo = {
      type: ElectronicFilingCommandType.UPDATE_EFILING_REQUEST,
      payload: {
        request: this.request,
        requestedBy
      }
    };

    this.processEvent(event);
  }


  private setSelectedStepperIndex() {
    if (!this.request.form || !this.request.form.fields) {
      this.selectedStepperIndex = 1;
    } else if (this.submitted || this.signed) {
      this.selectedStepperIndex = 3;
    } else if (!this.signed && this.isSigner) {
      this.selectedStepperIndex = 2;
    } else {
      this.selectedStepperIndex = 1;
    }
  }

}
