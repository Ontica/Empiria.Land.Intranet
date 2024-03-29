/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { AccessControlDataService } from '@app/data-services';

import { EmptySubject, Subject, SubjectFields } from '@app/models';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { sendEvent } from '@app/shared/utils';

import { SubjectHeaderEventType } from './subject-header.component';

export enum SubjectEditorEventType {
  SUBJECT_UPDATED = 'SubjectEditorComponent.Event.SubjectUpdated',
  SUBJECT_DELETED = 'SubjectEditorComponent.Event.SubjectDeleted',
}

@Component({
  selector: 'emp-ng-subject-editor',
  templateUrl: './subject-editor.component.html',
})
export class SubjectEditorComponent {

  @Input() subject: Subject = EmptySubject;

  @Input() canEdit = false;

  @Input() canGeneratePassword = false;

  @Input() isDeleted = false;

  @Output() subjectEditorEvent = new EventEmitter<EventInfo>();

  submitted = false;


  constructor(private accessControlData: AccessControlDataService,
              private messageBox: MessageBoxService) {

  }


  onSubjectHeaderEvent(event: EventInfo): void {
    if (this.submitted) {
      return;
    }

    switch (event.type as SubjectHeaderEventType) {
      case SubjectHeaderEventType.UPDATE_SUBJECT:
        Assertion.assertValue(event.payload.subject, 'event.payload.subject');
        this.updateSubject(this.subject.uid,  event.payload.subject as SubjectFields);
        return;
      case SubjectHeaderEventType.GENERATE_PASSWORD:
        this.generatePasswordToSubject();
        return;
      case SubjectHeaderEventType.DELETE_SUBJECT:
        this.deleteSubject();
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private updateSubject(subjectUID: string, subjectFields: SubjectFields) {
    this.submitted = true;

    this.accessControlData.updateSubject(subjectUID, subjectFields)
      .toPromise()
      .then(x => sendEvent(this.subjectEditorEvent, SubjectEditorEventType.SUBJECT_UPDATED, {subject: x}))
      .finally(() => this.submitted = false);
  }


  private generatePasswordToSubject() {
    this.submitted = true;

    this.accessControlData.resetCredentialsToSubject(this.subject.uid)
      .toPromise()
      .then(x =>
        this.messageBox.show('La operación se realizó correctamente.', 'Generar contraseña')
      )
      .finally(() => this.submitted = false);
  }


  private deleteSubject() {
    this.submitted = true;

    this.accessControlData.deleteSubject(this.subject.uid)
      .toPromise()
      .then(x => sendEvent(this.subjectEditorEvent, SubjectEditorEventType.SUBJECT_DELETED,
        {subjectUID: this.subject.uid}))
      .finally(() => this.submitted = false);
  }

}
