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
import { RecordableSubject } from '@app/models/recordable-subjects';
import { RecordableSubjectsStateSelector } from '@app/presentation/exported.presentation.types';
import { FormHandler } from '@app/shared/utils';


enum NoPropertyEditorFormControls {
  electronicID = 'electronicID',
  resourceKindUID = 'resourceKindUID',
  description = 'description',
  completed = 'completed',
}

@Component({
  selector: 'emp-land-no-property-editor',
  templateUrl: './no-property-editor.component.html',
})
export class NoPropertyEditorComponent implements OnInit, OnChanges, OnDestroy {

  @Input() recordableSubject: RecordableSubject;

  @Input() readonly = false;

  @Input() isAssociation: boolean;

  noProperty: any = {};

  helper: SubscriptionHelper;

  formHandler: FormHandler;
  controls = NoPropertyEditorFormControls;
  editorMode = false;
  submitted = false;
  isLoading = false;

  typeList: string[] = [];


  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit(): void {
    this.initForm();
    this.loadDataLists();
    this.setFormData();
    this.disableForm(true);
  }


  ngOnChanges() {
    if (this.recordableSubject) {
      Object.assign(this.noProperty, this.recordableSubject);
    }
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  enableEditor(enable) {
    this.editorMode = enable;

    if (!this.editorMode) {
      this.setFormData();
    }

    this.disableForm(!this.editorMode);
  }


  onElectronicHistoryClicked(){
    console.log('Historia del folio real: ', this.noProperty.electronicID);
  }


  onCompletedChange(change){
    this.setRequiredFormFields(change.checked);
    this.formHandler.invalidateForm();
  }


  submitRecordingAct() {

    if (this.submitted || !this.formHandler.validateReadyForSubmit()) {
      this.formHandler.invalidateForm();
      return;
    }

    const payload = {
      noProperty: this.getFormData()
    };

    console.log(payload);

    // this.executeCommand<Instrument>(InstrumentsCommandType.CREATE_PHYSICAL_RECORDING, payload);
  }


  private initForm() {
    this.formHandler = new FormHandler(
      new FormGroup({
        electronicID: new FormControl(''),
        resourceKindUID: new FormControl(''),
        description: new FormControl(''),
        completed: new FormControl(false),
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
        this.typeList = x.map(item => Object.create({ name: item }));
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
      resourceKindUID: this.noProperty.resourceKindUID || '',
      description: this.noProperty.description || '',
      completed: false, // this.noProperty.completed,
    });
  }


  private disableForm(disable) {
    this.formHandler.disableForm(disable);
    this.formHandler.disableControl(this.controls.electronicID);
  }


  private setRequiredFormFields(required: boolean){
    if (required) {
      this.formHandler.setControlValidators('resourceKindUID', Validators.required);
      this.formHandler.setControlValidators('description', Validators.required);
    } else {
      this.formHandler.clearControlValidators('resourceKindUID');
      this.formHandler.clearControlValidators('description');
    }
  }


  private getFormData(): any {
    Assertion.assert(this.formHandler.form.valid,
      'Programming error: form must be validated before command execution.');

    const formModel = this.formHandler.form.getRawValue();

    const data: any = {
      uid: this.noProperty.uid,
      name: this.noProperty.name,
      type: '',
      resourceKindUID: formModel.resourceKindUID ?? '',
      description: formModel.description ?? '',
      // completed: formModel.completed
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
