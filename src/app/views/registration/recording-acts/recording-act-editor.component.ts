/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { EventInfo, Identifiable, isEmpty } from '@app/core';

import { EmptyRecordingAct, RecordableObjectStatus, RecordableObjectStatusItem, RecordableObjectStatusList,
         RecordingAct, RecordingActFields} from '@app/models';

import { ArrayLibrary, FormatLibrary, FormHelper, sendEvent } from '@app/shared/utils';

export enum RecordingActEditorEventType {
  UPDATE_RECORDING_ACT = 'RecordingActEditorEventType.Event.UpdateRecordingAct',
}

interface RecordingAcEditionFormModel extends FormGroup<{
  typeUID: FormControl<string>;
  kind: FormControl<string>;
  operationAmount: FormControl<string>;
  currencyUID: FormControl<string>;
  description: FormControl<string>;
  status: FormControl<RecordableObjectStatus>;
}> { }

@Component({
  selector: 'emp-land-recording-act-editor',
  templateUrl: './recording-act-editor.component.html',
})
export class RecordingActEditorComponent implements OnChanges {

  @Input() recordingAct: RecordingAct = EmptyRecordingAct;

  @Input() readonly = false;

  @Output() recordingActEditorEvent = new EventEmitter<EventInfo>();

  form: RecordingAcEditionFormModel;

  formHelper = FormHelper;

  editionMode = false;

  statusList: RecordableObjectStatusItem[] = RecordableObjectStatusList;


  constructor() {
    this.initForm();
  }


  get isSaved(): boolean {
    return !isEmpty(this.recordingAct);
  }


  get displayAmendedAct(): boolean {
    return !isEmpty(this.recordingAct.amendedAct);
  }


  ngOnChanges() {
    if (this.isSaved) {
      this.enableEditor(false);
      this.insertRecordingActTypeToListIfNotExist();
    }
  }


  enableEditor(enable: boolean) {
    this.editionMode = enable;
    this.setFormModel();
    this.disableForm(!this.editionMode);
  }


  getCurrencyCode(): string {
    if (this.form.value.currencyUID === 'EURO') {
      return 'EUR';
    }

    if (['MXN', 'USD'].includes(this.form.value.currencyUID)) {
      return 'MXN';
    }

    return '';
  }


  onStatusChanges() {
    this.setRequiredFormFields();
  }


  onSubmitClicked() {
    if (this.formHelper.isFormReadyAndInvalidate(this.form)) {
      sendEvent(this.recordingActEditorEvent, RecordingActEditorEventType.UPDATE_RECORDING_ACT,
        { recordingActFields: this.getFormData() });
    }
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      typeUID: [''],
      kind: [''],
      operationAmount: [null],
      currencyUID: [''],
      description: [''],
      status: [null],
    });
  }


  private setFormModel() {
    this.form.reset({
      typeUID: this.recordingAct.type ?? null,
      kind: this.recordingAct.kind ?? null,
      operationAmount: this.recordingAct.operationAmount > 0 ?
        this.recordingAct.operationAmount.toString() : null,
      currencyUID: this.recordingAct.currencyUID && this.recordingAct.currencyUID !== 'Empty' ?
        this.recordingAct.currencyUID : null,
      description: this.recordingAct.description,
      status: this.recordingAct.status,
    });

    this.setRequiredFormFields();
  }


  private insertRecordingActTypeToListIfNotExist() {
    const type: Identifiable = {
      uid: this.recordingAct.type,
      name: this.recordingAct.name,
    };

    this.recordingAct.actions.editionValues.recordingActTypes = ArrayLibrary.insertIfNotExist(
      this.recordingAct.actions.editionValues.recordingActTypes ?? [], type, 'uid');
  }


  private setRequiredFormFields() {
    this.formHelper.clearControlValidators(this.form.controls.typeUID);
    this.formHelper.clearControlValidators(this.form.controls.kind);
    this.formHelper.clearControlValidators(this.form.controls.operationAmount);
    this.formHelper.clearControlValidators(this.form.controls.currencyUID);

    if (this.form.value.status !== 'Registered') {
      return;
    }

    if (this.recordingAct.actions.editableFields.includes('RecordingActType')) {
      this.formHelper.setControlValidators(this.form.controls.typeUID, Validators.required);
    }

    if (this.recordingAct.actions.editableFields.includes('Kinds')) {
      this.formHelper.setControlValidators(this.form.controls.kind, Validators.required);
    }

    if (this.recordingAct.actions.editableFields.includes('OperationAmount')) {
      this.formHelper.setControlValidators(this.form.controls.operationAmount, Validators.required);
      this.formHelper.setControlValidators(this.form.controls.currencyUID, Validators.required);
    }
  }


  private disableForm(disable: boolean) {
    this.formHelper.setDisableForm(this.form, disable);

    if (!disable) {
      const editableRecordingActType = this.recordingAct.actions.editableFields.includes('RecordingActType');
      const editableKind = this.recordingAct.actions.editableFields.includes('Kinds');
      const editableOperationAmount = this.recordingAct.actions.editableFields.includes('OperationAmount');

      this.formHelper.setDisableControl(this.form.controls.typeUID, !editableRecordingActType);
      this.formHelper.setDisableControl(this.form.controls.kind, !editableKind);
      this.formHelper.setDisableControl(this.form.controls.operationAmount, !editableOperationAmount);
      this.formHelper.setDisableControl(this.form.controls.currencyUID, !editableOperationAmount);
    }
  }


  private getFormData(): RecordingActFields {
    const formModel = this.form.getRawValue();

    const data: RecordingActFields = {
      typeUID: formModel.typeUID ?? '',
      kind: formModel.kind ?? '',
      operationAmount: FormatLibrary.stringToNumber(formModel.operationAmount),
      currencyUID: formModel.currencyUID ?? '',
      description: formModel.description ?? '',
      status: formModel.status ?? '' as RecordableObjectStatus,
    };

    return data;
  }

}
