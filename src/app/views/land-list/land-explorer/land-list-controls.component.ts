/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Entity, EventInfo, Identifiable, isEmpty } from '@app/core';

import { empExpandCollapse } from '@app/shared/utils/animations';

import { sendEvent } from '@app/shared/utils';


export enum ListControlsEventType {
  EXECUTE_OPERATION_CLICKED = 'ListControlsComponent.Event.ExecuteOperationClicked',
}

@Component({
  selector: 'emp-land-list-controls',
  templateUrl: './land-list-controls.component.html',
  animations: [
    empExpandCollapse
  ],
})
export class ListControlsComponent {

  @Input() itemsType: string = 'trámite';

  @Input() itemsSelected: Entity[] = [];

  @Input() operationsList: Identifiable[] = [];

  @Output() listControlsEvent = new EventEmitter<EventInfo>();

  operationSelected: Identifiable = null;

  constructor() { }


  get operationValid() {
    return isEmpty(this.operationSelected) ? false :true;
  }


  onExecuteOperationClicked() {
    if (this.operationValid) {
      this.emitExecuteOperationClicked();
    }
  }


  private emitExecuteOperationClicked() {
    const payload = {
      operation: this.operationSelected,
      selection: this.itemsSelected,
    };

    sendEvent(this.listControlsEvent, ListControlsEventType.EXECUTE_OPERATION_CLICKED, payload);
  }

}
