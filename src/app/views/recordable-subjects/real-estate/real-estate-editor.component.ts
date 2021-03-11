/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, Command, Identifiable } from '@app/core';
import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';
import { EmptyRealEstate, RealEstate, RecorderOffice } from '@app/models';
import { RealEstateFields } from '@app/models/recordable-subjects';
import { InstrumentsStateSelector } from '@app/presentation/exported.presentation.types';

import { FormHandler } from '@app/shared/utils';


enum RealEstateEditorFormControls {
  electronicID = 'electronicID',
  cadastralID = 'cadastralID',
  cadastreLinkingDate = 'cadastreLinkingDate',
  recorderOfficeUID = 'recorderOfficeUID',
  municipalityUID = 'municipalityUID',
  resourceKindUID = 'resourceKindUID',
  lotSize = 'lotSize',
  lotSizeUnitUID = 'lotSizeUnitUID',
  description = 'description',
  metesAndBounds = 'metesAndBounds',
  completedRealEstate = 'completedRealEstate',
}


@Component({
  selector: 'emp-land-real-estate-editor',
  templateUrl: './real-estate-editor.component.html',
  styles: [
  ]
})
export class RealEstateEditorComponent implements OnInit, OnDestroy {

  @Input() electronicID: string;

  @Input() readonly = false;

  realEstate: RealEstate = EmptyRealEstate;

  helper: SubscriptionHelper;

  formHandler: FormHandler;
  controls = RealEstateEditorFormControls;
  editorMode = false;
  submitted = false;
  isLoading = false;

  recorderOfficeList: RecorderOffice[] = [];
  municipalityList: Identifiable[] = [];
  realEstateTypeList: any[] = [];
  lotSizeUnitList: Identifiable[] = [];


  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit(): void {
    this.initForm();
    this.loadDataLists();
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


  onRecorderOfficeChange(recorderOffice: RecorderOffice){
    this.municipalityList = recorderOffice.municipalities;
  }


  onElectronicHistoryClicked(){
    console.log('Historia del folio real: ', this.realEstate.electronicID);
  }


  onCadastralCertificateClicked(){
    console.log('Cédula catastral: ', this.realEstate.cadastralID);
  }


  onCadastralClicked(){
    if (!this.editorMode || this.submitted) {
      return;
    }

    if (this.realEstate.cadastralID) {
      this.unlinkCadastralId();
    }else{
      this.linkCadastralId();
    }
  }


  onCompleteRealEstateChange(change){
    this.setRequiredFormFields(change.checked);
    this.formHandler.invalidateForm();
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


  private linkCadastralId(){
    console.log('Vincular clave catastral: ', this.formHandler.getControl(this.controls.cadastralID).value);
  }


  private unlinkCadastralId(){
    console.log('Desvincular clave catastral: ', this.realEstate.cadastralID);
  }


  private initForm() {
    this.formHandler = new FormHandler(
      new FormGroup({
        electronicID: new FormControl(''),
        cadastralID: new FormControl(''),
        cadastreLinkingDate: new FormControl(''),
        recorderOfficeUID: new FormControl(''),
        municipalityUID: new FormControl(''),
        resourceKindUID: new FormControl(''),
        lotSize: new FormControl(''),
        lotSizeUnitUID: new FormControl(''),
        description: new FormControl(''),
        metesAndBounds: new FormControl(''),
        completedRealEstate: new FormControl(false),
      })
    );
  }


  private loadDataLists() {
    this.helper.select<RecorderOffice[]>(InstrumentsStateSelector.RECORDER_OFFICE_LIST, {})
      .subscribe(x => {
        this.recorderOfficeList = x;
      });

    this.helper.select<string[]>(InstrumentsStateSelector.REAL_ESTATE_KIND_LIST, {})
      .subscribe(x => {
        this.realEstateTypeList = x.map(item => Object.create({ name: item }));
      });

    this.helper.select<Identifiable[]>(InstrumentsStateSelector.REAL_ESTATE_LOTE_SIZE_UNIT_LIST, {})
      .subscribe(x => {
        this.lotSizeUnitList = x;
      });
  }


  private setFormData() {
    if (!this.realEstate) {
      this.formHandler.form.reset();
      return;
    }

    this.formHandler.form.reset({
      electronicID: this.realEstate.electronicID || '',
      cadastralID: this.realEstate.cadastralID || '',
      cadastreLinkingDate: this.realEstate.cadastreLinkingDate || '',
      recorderOfficeUID: this.realEstate.recorderOffice.uid || '',
      municipalityUID: this.realEstate.municipality.uid || '',
      resourceKindUID: this.realEstate.resourceKind.uid || '',
      lotSize: this.realEstate.lotSize || '',
      lotSizeUnitUID: this.realEstate.lotSizeUnit.uid || '',
      description: this.realEstate.description || '',
      metesAndBounds: this.realEstate.metesAndBounds || '',
      completedRealEstate: false, // this.realEstate.completedRealEstate,
    });
  }


  private disableForm(disable) {
    this.formHandler.disableForm(disable);
    this.formHandler.disableControl(this.controls.electronicID);
    this.formHandler.disableControl(this.controls.cadastreLinkingDate);
  }


  private setRequiredFormFields(required: boolean){
    if (required) {
      this.formHandler.setControlValidators('cadastralID', Validators.required);
      this.formHandler.setControlValidators('recorderOfficeUID', Validators.required);
      this.formHandler.setControlValidators('municipalityUID', Validators.required);
      this.formHandler.setControlValidators('resourceKindUID', Validators.required);
      this.formHandler.setControlValidators('lotSize', Validators.required);
      this.formHandler.setControlValidators('lotSizeUnitUID', Validators.required);
      this.formHandler.setControlValidators('description', Validators.required);
      this.formHandler.setControlValidators('metesAndBounds', Validators.required);
    } else {
      this.formHandler.clearControlValidators('cadastralID');
      this.formHandler.clearControlValidators('recorderOfficeUID');
      this.formHandler.clearControlValidators('municipalityUID');
      this.formHandler.clearControlValidators('resourceKindUID');
      this.formHandler.clearControlValidators('lotSize');
      this.formHandler.clearControlValidators('lotSizeUnitUID');
      this.formHandler.clearControlValidators('description');
      this.formHandler.clearControlValidators('metesAndBounds');
    }
  }


  private getFormData(): any {
    Assertion.assert(this.formHandler.form.valid,
      'Programming error: form must be validated before command execution.');

    const formModel = this.formHandler.form.getRawValue();

    const data: RealEstateFields = {
      uid: this.realEstate.uid,
      name: this.realEstate.name,
      type: '',

      electronicID: formModel.electronicID ?? '',
      cadastralID: formModel.cadastralID ?? '',
      districtUID: formModel.recorderOfficeUID ?? '',
      municipalityUID: formModel.municipalityUID ?? '',
      kind: formModel.resourceKindUID ?? '',
      lotSize: formModel.lotSize ?? 0,
      lotSizeUnitUID: formModel.lotSizeUnitUID ?? '',
      description: formModel.description ?? '',
      metesAndBounds: formModel.metesAndBounds ?? '',
      // completedRealEstate: formModel.completedRealEstate
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
