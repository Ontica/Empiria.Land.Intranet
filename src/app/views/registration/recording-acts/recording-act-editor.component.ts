/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { EventInfo, isEmpty } from '@app/core';

import { EmptyRecordingAct, RecordableObjectStatusItem, RecordableObjectStatusList,
         RecordingAct,
         RecordingActFields} from '@app/models';

import { FormatLibrary, FormHandler } from '@app/shared/utils';

export enum RecordingActEditorEventType {
  UPDATE_RECORDING_ACT = 'RecordingActEditorEventType.Event.UpdateRecordingAct',
}

enum RecordingActEditorControls {
  typeUID = 'typeUID',
  kind = 'kind',
  operationAmount = 'operationAmount',
  currencyUID = 'currencyUID',
  description = 'description',
  status = 'status',
}


@Component({
  selector: 'emp-land-recording-act-editor',
  templateUrl: './recording-act-editor.component.html',
  styles: [
  ]
})
export class RecordingActEditorComponent implements OnInit, OnChanges {

  @Input() recordingAct: RecordingAct = EmptyRecordingAct;

  @Output() recordingActEditorEvent = new EventEmitter<EventInfo>();

  formHandler: FormHandler;
  controls = RecordingActEditorControls;
  editionMode = false;

  statusList: RecordableObjectStatusItem[] = RecordableObjectStatusList;

  constructor() {
    this.initForm();
  }


  ngOnInit(): void {
  }


  ngOnChanges() {
    if (!isEmpty(this.recordingAct)) {
      this.enableEditor(false);
    }
  }


  enableEditor(enable: boolean) {
    this.editionMode = enable;
    this.setFormModel();
    this.formHandler.disableForm(!this.editionMode);
  }


  getCurrencyCode() {
    if (this.formHandler.getControl(this.controls.currencyUID).value === 'EURO') {
      return 'EUR';
    }

    if (['MXN', 'USD'].includes(this.formHandler.getControl(this.controls.currencyUID).value)) {
      return 'MXN';
    }

    return '';
  }


  onStatusChange() {
    this.setRequiredFormFields();
  }


  submit() {
    if (!this.formHandler.isValid) {
      this.formHandler.invalidateForm();
      return;
    }

    this.sendEvent(RecordingActEditorEventType.UPDATE_RECORDING_ACT,
                   { recordingActFields: this.getFormData() });
  }


  private initForm() {
    this.formHandler = new FormHandler(
      new FormGroup({
        typeUID: new FormControl(''),
        kind: new FormControl(''),
        operationAmount: new FormControl(''),
        currencyUID: new FormControl(''),
        description: new FormControl(''),
        status: new FormControl(''),
      }));
  }


  private setFormModel() {
    this.formHandler.form.reset({
      typeUID: this.recordingAct.type ?? null,
      kind: this.recordingAct.kind ?? null,
      operationAmount: this.recordingAct.operationAmount > 0 ? this.recordingAct.operationAmount : null,
      currencyUID: this.recordingAct.currencyUID && this.recordingAct.currencyUID !== 'Empty' ?
        this.recordingAct.currencyUID : null,
      description: this.recordingAct.description,
      status: this.recordingAct.status
    });

    this.setRequiredFormFields();
  }


  private setRequiredFormFields() {
    this.formHandler.clearControlValidators(this.controls.typeUID);
    this.formHandler.clearControlValidators(this.controls.kind);
    this.formHandler.clearControlValidators(this.controls.operationAmount);
    this.formHandler.clearControlValidators(this.controls.currencyUID);

    if (this.formHandler.getControl(this.controls.status).value !== 'Registered') {
      return;
    }

    if (this.recordingAct.actions.editableFields.includes('RecordingActType')) {
      this.formHandler.setControlValidators(this.controls.typeUID, Validators.required);
    }

    if (this.recordingAct.actions.editableFields.includes('Kinds')) {
      this.formHandler.setControlValidators(this.controls.kind, Validators.required);
    }

    if (this.recordingAct.actions.editableFields.includes('OperationAmount')) {
      this.formHandler.setControlValidators(this.controls.operationAmount, Validators.required);
      this.formHandler.setControlValidators(this.controls.currencyUID, Validators.required);
    }
  }


  private getFormData(): RecordingActFields {
    const formModel = this.formHandler.form.getRawValue();

    const data: RecordingActFields = {
      typeUID: formModel.typeUID ?? '',
      kind: formModel.kind ?? '',
      operationAmount: FormatLibrary.stringToNumber(formModel.operationAmount),
      currencyUID: formModel.currencyUID ?? '',
      description: formModel.description ?? '',
      status: formModel.status ?? '',
    };

    return data;
  }


  private sendEvent(eventType: RecordingActEditorEventType, payload?: any) {
    const event: EventInfo = {
      type: eventType,
      payload
    };

    this.recordingActEditorEvent.emit(event);
  }

}