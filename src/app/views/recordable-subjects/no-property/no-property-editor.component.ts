/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { InstrumentRecording, RecorderOffice, RecordingAct } from '@app/models';

import { RecordableSubject, RecordableSubjectStatusList } from '@app/models/recordable-subjects';

import { RecordableSubjectsStateSelector } from '@app/presentation/exported.presentation.types';

import { FormHandler } from '@app/shared/utils';

export enum NoPropertyEditorComponentEventType {
  UPDATE_NO_PROPERTY = 'NoPropertyEditorComponent.Event.UpdateNoProperty',
}

enum NoPropertyEditorFormControls {
  electronicID = 'electronicID',
  recorderOfficeUID = 'recorderOfficeUID',
  kind = 'kind',
  name = 'name',
  status = 'status',
}


@Component({
  selector: 'emp-land-no-property-editor',
  templateUrl: './no-property-editor.component.html',
})
export class NoPropertyEditorComponent implements OnInit, OnChanges, OnDestroy {

  @Input() instrumentRecording: InstrumentRecording;
  @Input() recordingAct: RecordingAct;
  @Input() recordableSubject: RecordableSubject;
  @Input() isAssociation: boolean;
  @Input() readonly = false;
  @Output() noPropertyEditorEvent = new EventEmitter<EventInfo>();

  noProperty: any = {};

  helper: SubscriptionHelper;

  formHandler: FormHandler;
  controls = NoPropertyEditorFormControls;
  editionMode = false;
  isLoading = false;

  recorderOfficeList: RecorderOffice[] = [];
  kindsList: string[] = [];
  statusList: any[] = RecordableSubjectStatusList;

  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit(): void {
    this.loadDataLists();
  }


  ngOnChanges() {
    if (this.recordableSubject) {
      Object.assign(this.noProperty, this.recordableSubject);
      this.initForm();
      this.enableEditor(false);
    }
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  enableEditor(enable) {
    this.editionMode = enable;

    if (!this.editionMode) {
      this.setFormData();
    }

    this.setRequiredFormFields(this.noProperty.status === 'Closed');
    this.disableForm(!this.editionMode);
  }


  onElectronicHistoryClicked(){
    console.log('Historia del folio real: ', this.noProperty.electronicID);
  }


  onStatusChange(change){
    this.setRequiredFormFields(change.status === 'Closed');
    this.formHandler.invalidateForm();
  }


  submitForm() {
    if (!this.formHandler.validateReadyForSubmit()) {
      this.formHandler.invalidateForm();
      return;
    }

    const payload = {
      instrumentRecordingUID: this.instrumentRecording.uid,
      recordingActUID: this.recordingAct.uid,
      recordableSubjectFields: this.getFormData()
    };

    this.sendEvent(NoPropertyEditorComponentEventType.UPDATE_NO_PROPERTY, payload);
  }


  private initForm() {
    if (this.formHandler) {
      return;
    }

    this.formHandler = new FormHandler(
      new FormGroup({
        electronicID: new FormControl(''),
        recorderOfficeUID: new FormControl(''),
        kind: new FormControl(''),
        name: new FormControl(''),
        status: new FormControl(''),
      })
    );
  }


  private loadDataLists() {
    this.isLoading = true;

    let selector = RecordableSubjectsStateSelector.ASSOCIATION_KIND_LIST;

    if (!this.isAssociation) {
      selector = RecordableSubjectsStateSelector.NO_PROPERTY_KIND_LIST;
    }

    this.helper.select<string[]>(selector)
      .subscribe(x => {
        this.kindsList = x.map(item => Object.create({ name: item }));
        this.isLoading = false;
      });

    this.helper.select<RecorderOffice[]>(RecordableSubjectsStateSelector.RECORDER_OFFICE_LIST)
      .subscribe(x => {
        this.recorderOfficeList = x;
      });
  }


  private setFormData() {
    if (!this.noProperty) {
      this.formHandler.form.reset();
      return;
    }

    this.formHandler.form.reset({
      electronicID: this.noProperty.electronicID || '',
      recorderOfficeUID: isEmpty(this.noProperty.recorderOffice) ? '' : this.noProperty.recorderOffice.uid,
      kind: this.noProperty.kind || '',
      name: this.noProperty.name || '',
      status: this.noProperty.status,
    });
  }


  private disableForm(disable) {
    this.formHandler.disableForm(disable);
    this.formHandler.disableControl(this.controls.electronicID);
  }


  private setRequiredFormFields(required: boolean){
    if (required) {
      this.formHandler.setControlValidators('recorderOfficeUID', Validators.required);
      this.formHandler.setControlValidators('kind', Validators.required);
      this.formHandler.setControlValidators('name', Validators.required);
    } else {
      this.formHandler.setControlValidators('recorderOfficeUID', Validators.required);
      this.formHandler.clearControlValidators('kind');
      this.formHandler.clearControlValidators('name');
    }
  }


  private getFormData(): any {
    Assertion.assert(this.formHandler.form.valid,
      'Programming error: form must be validated before command execution.');

    const formModel = this.formHandler.form.getRawValue();

    const data: any = {
      uid: this.recordableSubject.uid,
      type: this.recordableSubject.type,
      electronicID: formModel.electronicID ?? '',
      recorderOfficeUID: formModel.recorderOfficeUID ?? '',
      kind: formModel.kind ?? '',
      name: formModel.name ?? '',
      // status: formModel.status ?? '',
    };

    return data;
  }

  private sendEvent(eventType: NoPropertyEditorComponentEventType, payload?: any) {
    const event: EventInfo = {
      type: eventType,
      payload
    };

    this.noPropertyEditorEvent.emit(event);
  }

}
