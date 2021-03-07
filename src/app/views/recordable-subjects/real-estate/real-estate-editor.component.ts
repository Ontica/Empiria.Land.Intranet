/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { Assertion, Command } from '@app/core';
import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { RealEstateFields } from '@app/models/recordable-subjects';
import { FormHandler } from '@app/shared/utils';


enum RealEstateEditorFormControls {
  electronicID = 'electronicID',
  cadastralID = 'cadastralID',
  cadastralDate = 'cadastralDate',
  districtUID = 'districtUID',
  municipalityUID = 'municipalityUID',
  type = 'type',
  lotSize = 'lotSize',
  lotSizeUnitUID = 'lotSizeUnitUID',
  location = 'location',
  metesAndBounds = 'metesAndBounds',
}


@Component({
  selector: 'emp-land-real-estate-editor',
  templateUrl: './real-estate-editor.component.html',
  styles: [
  ]
})
export class RealEstateEditorComponent implements OnInit, OnDestroy {

  @Input() realEstate: RealEstateFields;

  @Input() readonly = false;

  helper: SubscriptionHelper;

  formHandler: FormHandler;
  controls = RealEstateEditorFormControls;
  editorMode = false;
  submitted = false;
  isLoading = false;

  districtList: any[] = [];
  municipalityList: any[] = [];
  realEstateTypeList: any[] = [];
  lotSizeUnitList: any[] = [];


  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
   }


  ngOnInit(): void {
    this.initForm();

    this.setFormData();
    this.disableForm(true);
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


  submitRecordingAct() {

    if (this.submitted || !this.formHandler.validateReadyForSubmit()) {
      this.formHandler.invalidateForm();
      return;
    }

    const payload = {
      realEstate: this.getFormData()
    };

    console.log(payload);

    // this.executeCommand<Instrument>(InstrumentsCommandType.CREATE_PHYSICAL_RECORDING, payload);
  }


  private initForm() {
    this.formHandler = new FormHandler(
      new FormGroup({
        electronicID: new FormControl(''),
        cadastralID: new FormControl(''),
        cadastralDate: new FormControl(''),
        districtUID: new FormControl(''),
        municipalityUID: new FormControl(''),
        type: new FormControl(''),
        lotSize: new FormControl(''),
        lotSizeUnitUID: new FormControl(''),
        location: new FormControl(''),
        metesAndBounds: new FormControl(''),
      })
    );
  }


   private setFormData() {
    if (!this.realEstate) {
      this.formHandler.form.reset();
      return;
    }

    this.formHandler.form.reset({
      electronicID: this.realEstate.electronicID || '',
      cadastralID: this.realEstate.cadastralID || '',
      cadastralDate: '', // this.realEstate.cadastralDate || '',
      districtUID: this.realEstate.districtUID || '',
      municipalityUID: this.realEstate.municipalityUID || '',
      type: this.realEstate.type || '',
      lotSize: this.realEstate.lotSize || '',
      lotSizeUnitUID: this.realEstate.lotSizeUnitUID || '',
      location: this.realEstate.location || '',
      metesAndBounds: this.realEstate.metesAndBounds || '',
    });
  }


  private disableForm(disable) {
    this.formHandler.disableForm(disable);
    this.formHandler.disableControl(this.controls.electronicID);
    this.formHandler.disableControl(this.controls.cadastralDate);
  }


  private getFormData(): any {
    Assertion.assert(this.formHandler.form.valid,
      'Programming error: form must be validated before command execution.');

    const formModel = this.formHandler.form.getRawValue();

    const data: any = {
      electronicID: formModel.electronicID ?? '',
      cadastralID: formModel.cadastralID ?? '',
      cadastralDate: formModel.cadastralDate ?? '',
      districtUID: formModel.districtUID ?? '',
      municipalityUID: formModel.municipalityUID ?? '',
      type: formModel.type ?? '',
      lotSize: formModel.lotSize ?? '',
      lotSizeUnitUID: formModel.lotSizeUnitUID ?? '',
      location: formModel.location ?? '',
      metesAndBounds: formModel.metesAndBounds ?? '',
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
