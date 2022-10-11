/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { RealEstate, RecordableSubject, RecordableSubjectType } from '@app/models';

import { AlertService } from '@app/shared/containers/alert/alert.service';

import { sendEvent } from '@app/shared/utils';

export enum RecordableSubjectViewEventType {
  RECORDABLE_SUBJECT_CLICKED = 'RecordableSubjectViewComponent.Event.RecordableSubjectClicked',
  CADASTRAL_CLICKED          = 'RecordableSubjectViewComponent.Event.CadastralClicked',
}


@Component({
  selector: 'emp-land-recordable-subject-view',
  templateUrl: './recordable-subject-view.component.html',
})
export class RecordableSubjectViewComponent {

  @Input() recordableSubject: RecordableSubject;

  @Input() showCopyPaste = true;

  @Output() recordableSubjectViewEvent = new EventEmitter<EventInfo>();


  constructor(private alertService: AlertService) {

  }


  get displayRealEstate(): boolean {
    return this.recordableSubject.type === RecordableSubjectType.RealEstate;
  }


  get realEstate(): RealEstate {
    return this.recordableSubject as RealEstate;
  }


  get displayCadastralData(): boolean {
    return this.displayRealEstate && !!this.realEstate.cadastralID;
  }


  onRecordableSubjectClicked() {
    sendEvent(this.recordableSubjectViewEvent,
      RecordableSubjectViewEventType.RECORDABLE_SUBJECT_CLICKED, {recordableSubject: this.recordableSubject});
  }


  onCadastralClicked() {
    sendEvent(this.recordableSubjectViewEvent,
      RecordableSubjectViewEventType.CADASTRAL_CLICKED, {recordableSubject: this.recordableSubject});
  }


  showAlertTextCopied(copied: boolean) {
    const message = copied ? 'Folio electrónico copiado' : 'Tuve un problema al copiar el electrónico';
    this.alertService.openAlert(message, 'Ok');
  }

}
