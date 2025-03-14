/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { LandEntity, LandExplorerTypes, SignableDocumentDescriptor } from '@app/models';


@Component({
  selector: 'emp-land-list-item',
  templateUrl: './land-list-item.component.html',
})
export class LandListItemComponent {

  @Input() explorerType = LandExplorerTypes.TRANSACTION;

  @Input() item: LandEntity;

  @Input() listOptions: any[] = [{name: 'Cambiar estado', value: 'SetNextStatus'}];

  @Output() optionsClick = new EventEmitter<boolean>();


  onClickItemOptions(option) {
    this.optionsClick.emit(option.value);
  }


  get displayDocument(): boolean {
    return this.explorerType === LandExplorerTypes.ESIGN_DOCUMENT;
  }


  get documentID(): string {
    return (this.item as SignableDocumentDescriptor).documentID ?? 'N/D';
  }

}
