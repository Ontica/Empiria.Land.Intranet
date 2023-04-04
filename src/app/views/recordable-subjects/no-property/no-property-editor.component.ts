/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { combineLatest } from 'rxjs';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { FormHelper, sendEvent } from '@app/shared/utils';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { RecordableSubjectsStateSelector } from '@app/presentation/exported.presentation.types';

import { EmptyNoProperty, NoProperty, NoPropertyFields, RecordableObjectStatus, RecordableObjectStatusItem,
         RecordableObjectStatusList, RecordableSubject, RecorderOffice } from '@app/models';

export enum NoPropertyEditorComponentEventType {
  UPDATE_NO_PROPERTY = 'NoPropertyEditorComponent.Event.UpdateNoProperty',
}

interface NoPropertyFormModel extends FormGroup<{
  electronicID: FormControl<string>;
  recorderOfficeUID: FormControl<string>;
  kind: FormControl<string>;
  name: FormControl<string>;
  description: FormControl<string>;
  status: FormControl<RecordableObjectStatus>;
}> {}

@Component({
  selector: 'emp-land-no-property-editor',
  templateUrl: './no-property-editor.component.html',
})
export class NoPropertyEditorComponent implements OnInit, OnChanges, OnDestroy {

  @Input() instrumentRecordingUID = '';

  @Input() recordingActUID = '';

  @Input() recordableSubject: RecordableSubject;

  @Input() isAssociation: boolean;

  @Input() readonly = false;

  @Input() showElectronicHistoryButton = true;

  @Output() noPropertyEditorEvent = new EventEmitter<EventInfo>();

  noProperty: NoProperty = EmptyNoProperty;

  helper: SubscriptionHelper;

  form: NoPropertyFormModel;

  formHelper = FormHelper;

  editionMode = false;

  isLoading = false;

  recorderOfficeList: RecorderOffice[] = [];

  kindsList: string[] = [];

  statusList: RecordableObjectStatusItem[] = RecordableObjectStatusList;

  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
    this.initForm();
  }


  ngOnInit() {
    this.loadDataLists();
  }


  ngOnChanges() {
    if (this.recordableSubject) {
      this.setNoProperty();
      this.enableEditor(false);
    }
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  enableEditor(enable: boolean) {
    this.editionMode = enable;

    if (!this.editionMode) {
      this.setFormData();
    }

    this.setRequiredFormFields(this.noProperty.status === 'Registered');
    this.setDisableForm(!this.editionMode);
  }


  onStatusChanges(change: RecordableObjectStatusItem) {
    this.setRequiredFormFields(change.status === 'Registered');
    this.formHelper.markFormControlsAsTouched(this.form);
  }


  onElectronicHistoryClicked(){
    console.log('Historia del folio real: ', this.noProperty.electronicID);
  }


  onSubmitClicked() {
    if (this.formHelper.isFormReadyAndInvalidate(this.form)) {
      const payload = {
        instrumentRecordingUID: this.instrumentRecordingUID,
        recordingActUID: this.recordingActUID,
        recordableSubjectFields: this.getFormData()
      };

      sendEvent(this.noPropertyEditorEvent, NoPropertyEditorComponentEventType.UPDATE_NO_PROPERTY, payload);
    }
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      electronicID: [''],
      recorderOfficeUID: [''],
      kind: [''],
      name: [''],
      description: [''],
      status: [null],
    });
  }


  private loadDataLists() {
    this.isLoading = true;

    const selector = this.isAssociation ? RecordableSubjectsStateSelector.ASSOCIATION_KIND_LIST :
      RecordableSubjectsStateSelector.NO_PROPERTY_KIND_LIST;

    combineLatest([
      this.helper.select<string[]>(selector),
      this.helper.select<RecorderOffice[]>(RecordableSubjectsStateSelector.RECORDER_OFFICE_LIST),
    ])
    .subscribe(([a, b]) => {
      this.kindsList = a.map(item => Object.create({ name: item }));
      this.recorderOfficeList = b;
      this.isLoading = false;
    });
  }


  private setNoProperty() {
    this.noProperty = Object.assign({}, EmptyNoProperty, this.recordableSubject);
  }


  private setFormData() {
    if (isEmpty(this.noProperty)) {
      this.form.reset();
      return;
    }

    this.form.reset({
      electronicID: this.noProperty.electronicID || '',
      recorderOfficeUID: isEmpty(this.noProperty.recorderOffice) ? '' : this.noProperty.recorderOffice.uid,
      kind: this.noProperty.kind || '',
      name: this.noProperty.name || '',
      description: this.noProperty.description || '',
      status: this.noProperty.status,
    });
  }


  private setDisableForm(disable: boolean) {
    this.formHelper.setDisableForm(this.form, disable);
    this.formHelper.setDisableControl(this.form.controls.electronicID);
  }


  private setRequiredFormFields(required: boolean) {
    if (required) {
      this.formHelper.setControlValidators(this.form.controls.recorderOfficeUID, Validators.required);
      this.formHelper.setControlValidators(this.form.controls.kind, Validators.required);
      this.formHelper.setControlValidators(this.form.controls.name, Validators.required);
    } else {
      this.formHelper.setControlValidators(this.form.controls.recorderOfficeUID, Validators.required);
      this.formHelper.clearControlValidators(this.form.controls.kind);
      this.formHelper.clearControlValidators(this.form.controls.name);
    }
  }


  private getFormData(): NoPropertyFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const formModel = this.form.getRawValue();

    const data: NoPropertyFields = {
      uid: this.recordableSubject.uid,
      type: this.recordableSubject.type,
      electronicID: formModel.electronicID ?? '',
      recorderOfficeUID: formModel.recorderOfficeUID ?? '',
      kind: formModel.kind ?? '',
      name: formModel.name ?? '',
      description: formModel.description ?? '',
      status: formModel.status
    };

    return data;
  }

}
