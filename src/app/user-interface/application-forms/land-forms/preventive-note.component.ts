/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, OnChanges, Output, EventEmitter } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { EventInfo } from '@app/core';

import { PreventiveNote, EFilingRequest, RealPropertyData } from '@app/domain/models';

import { ApplicationFormComponent, ApplicationFormHandler } from './common/application-form-handler';


@Component({
  selector: 'emp-land-preventive-note',
  templateUrl: './preventive-note.component.html'
})
export class PreventiveNoteComponent implements ApplicationFormComponent, OnChanges {

  @Input() request: EFilingRequest;

  @Output() editionEvent = new EventEmitter<EventInfo>();

  form = new FormGroup({
    propertyUID: new FormControl(''),
    recordingSeekData: new FormControl(),
    projectedOperation: new FormControl('', Validators.required),
    grantors: new FormControl('', Validators.required),
    grantees: new FormControl('', Validators.required),
    createPartition: new FormControl('', Validators.required),
    partitionName: new FormControl({ value: '', disabled: true }),
    observations: new FormControl(''),
  });

  formHandler: ApplicationFormHandler;

  useRecordingSeekData = false;


  constructor() {
    this.formHandler = new ApplicationFormHandler(this);
  }


  ngOnChanges() {
    this.resetForm();
  }


  onEdit() {
    const afterEditDoThis = () => {
      this.onUpdateUI('createPartition');
    };

    this.formHandler.onEdit(afterEditDoThis);
 }


  onSubmit() {
    const whenValidationDoThis = () => {
      this.setControlsValidation();
      this.validatePartition();
    };

    this.formHandler.onSubmit(whenValidationDoThis);
  }


  onUpdateUI(control: string) {
    switch (control) {
      case 'createPartition':
        this.updateCreatePartitionUI();
        break;
    }
  }


  toggleUseRecordingSeekData() {
    if (!this.formHandler.editionMode) {
      return;
    }

    this.useRecordingSeekData = !this.useRecordingSeekData;

    this.setControlsValidation();
  }


  getFormData(): PreventiveNote {
    const formModel = this.form.value;

    const propertyData = this.getRealPropertyFormData();

    const data = {
      propertyData,
      projectedOperation: this.formHandler.toUpperCase('projectedOperation'),
      grantors: this.formHandler.toUpperCase('grantors'),
      grantees: this.formHandler.toUpperCase('grantees'),
      createPartition: formModel.createPartition === 'true' ? true : false,
      partitionName: this.formHandler.toUpperCase('partitionName'),
      observations: this.formHandler.toUpperCase('observations')
    };

    return data;
  }


  resetForm() {
    this.formHandler.clearForm();

    if (!this.request.form) {
      return;
    }

    const appForm = this.request.form.fields as PreventiveNote;

    this.form.reset({
      propertyUID: appForm.propertyData.propertyUID || '',
      recordingSeekData: appForm.propertyData.recordingSeekData || null,
      projectedOperation: appForm.projectedOperation || '',
      grantors: appForm.grantors || '',
      grantees: appForm.grantees || '',
      createPartition: appForm.createPartition !== null ? appForm.createPartition : '',
      partitionName: appForm.partitionName || '',
      observations: appForm.observations || ''
    });

    if (appForm.propertyData.recordingSeekData) {
      this.useRecordingSeekData = true;
    } else {
      this.useRecordingSeekData = false;
    }
    this.setControlsValidation();
  }


  // private members

  private getRealPropertyFormData(): RealPropertyData {
    const formModel = this.form.value;

    if (this.useRecordingSeekData) {
      return {
        recordingSeekData: formModel.recordingSeekData
      };
    } else {
      return {
        propertyUID: formModel.propertyUID,
      };
    }
  }


  private setControlsValidation() {
    if (this.useRecordingSeekData) {
      this.form.get('recordingSeekData').setValidators(Validators.required);
      this.form.get('recordingSeekData').updateValueAndValidity();

      this.form.get('propertyUID').clearValidators();
      this.form.get('propertyUID').updateValueAndValidity();

    } else {
      this.form.get('recordingSeekData').clearValidators();
      this.form.get('recordingSeekData').updateValueAndValidity();

      this.form.get('propertyUID').setValidators(Validators.required);
      this.form.get('propertyUID').updateValueAndValidity();
    }
  }


  private updateCreatePartitionUI() {
    const createPartition = this.form.get('createPartition');
    const partitionName = this.form.get('partitionName');

    if (createPartition.value === null) {
      createPartition.setValue('');
    }

    if (createPartition.value === 'true' || createPartition.value === true) {
      partitionName.enable();
    } else {
      partitionName.disable();
      partitionName.setValue('');
    }
  }


  private validatePartition() {
    const createPartition = this.form.get('createPartition');

    if (createPartition.value === 'true') {
      this.formHandler.setControlAsRequired('partitionName',
                                            'Requiero se proporcione el nombre de la fracción.');
    } else {
      this.formHandler.setControlAsOptional('partitionName');
    }
  }

}
