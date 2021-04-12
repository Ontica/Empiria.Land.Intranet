/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Assertion, Command } from '@app/core';
import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';
import { InstrumentRecording, RecordingAct } from '@app/models';
import { RecordableSubject, RecordableSubjectStatusList } from '@app/models/recordable-subjects';
import { RecordableSubjectsStateSelector, RegistrationCommandType } from '@app/presentation/exported.presentation.types';
import { FormHandler } from '@app/shared/utils';


enum NoPropertyEditorFormControls {
  electronicID = 'electronicID',
  kind = 'kind',
  description = 'description',
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

  noProperty: any = {};

  helper: SubscriptionHelper;

  formHandler: FormHandler;
  controls = NoPropertyEditorFormControls;
  editionMode = false;
  submitted = false;
  isLoading = false;

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
    if (this.submitted || !this.formHandler.validateReadyForSubmit()) {
      this.formHandler.invalidateForm();
      return;
    }

    const payload = {
      instrumentRecordingUID: this.instrumentRecording.uid,
      recordingActUID: this.recordingAct.uid,
      recordableSubjectFields: this.getFormData()
    };

    this.executeCommand(RegistrationCommandType.UPDATE_RECORDABLE_SUBJECT, payload);
  }


  private initForm() {
    if (this.formHandler) {
      return;
    }

    this.formHandler = new FormHandler(
      new FormGroup({
        electronicID: new FormControl(''),
        kind: new FormControl(''),
        description: new FormControl(''),
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
  }


  private setFormData() {
    if (!this.noProperty) {
      this.formHandler.form.reset();
      return;
    }

    this.formHandler.form.reset({
      electronicID: this.noProperty.electronicID || '',
      kind: this.noProperty.kind || '',
      description: this.isAssociation ? this.noProperty.name || '' : this.noProperty.description || '',
      status: this.noProperty.status,
    });
  }


  private disableForm(disable) {
    this.formHandler.disableForm(disable);
    this.formHandler.disableControl(this.controls.electronicID);
  }


  private setRequiredFormFields(required: boolean){
    if (required) {
      this.formHandler.setControlValidators('kind', Validators.required);
      this.formHandler.setControlValidators('description', Validators.required);
    } else {
      this.formHandler.clearControlValidators('kind');
      this.formHandler.clearControlValidators('description');
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
      kind: formModel.kind ?? '',
      name: this.isAssociation && formModel.description ? formModel.description : '',
      description: !this.isAssociation && formModel.description ? formModel.description : '',
      // status: formModel.status ?? '',
    };

    return data;
  }


  private executeCommand<T>(commandType: any, payload?: any): Promise<T> {
    this.submitted = true;

    const command: Command = {
      type: commandType,
      payload
    };

    return this.uiLayer.execute<T>(command)
      .finally(() => this.submitted = false);
  }

}
