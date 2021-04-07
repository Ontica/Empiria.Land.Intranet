/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, Command, Identifiable, isEmpty } from '@app/core';
import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';
import { EmptyRealEstate, InstrumentRecording, RealEstate, RecorderOffice, RecordingAct } from '@app/models';
import { RealEstateFields, RecordableSubjectStatusList } from '@app/models/recordable-subjects';
import { RecordableSubjectsStateSelector,
         RegistrationCommandType } from '@app/presentation/exported.presentation.types';

import { ArrayLibrary, FormHandler } from '@app/shared/utils';


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
  status = 'status',
}


@Component({
  selector: 'emp-land-real-estate-editor',
  templateUrl: './real-estate-editor.component.html',
  styles: [
  ]
})
export class RealEstateEditorComponent implements OnInit, OnChanges, OnDestroy {

  @Input() instrumentRecording: InstrumentRecording;
  @Input() recordingAct: RecordingAct;
  @Input() realEstate: RealEstate = EmptyRealEstate;

  @Input() readonly = false;

  helper: SubscriptionHelper;

  formHandler: FormHandler;
  controls = RealEstateEditorFormControls;
  editionMode = false;
  submitted = false;
  isLoading = false;

  recorderOfficeList: RecorderOffice[] = [];
  municipalityList: Identifiable[] = [];
  realEstateTypeList: string[] = [];
  lotSizeUnitList: Identifiable[] = [];
  statusList: any[] = RecordableSubjectStatusList;


  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit(): void {
    this.loadDataLists();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.realEstate) {
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

    this.setRecorderOfficeAndMunicipalityDataList();
    this.disableForm(!this.editionMode);
  }


  onRecorderOfficeChange(recorderOffice: RecorderOffice) {
    this.municipalityList = recorderOffice?.municipalities ?? [];
    this.formHandler.getControl(this.controls.municipalityUID).reset();
  }


  onElectronicHistoryClicked() {
    console.log('Historia del folio real: ', this.realEstate.electronicID);
  }


  onCadastralCertificateClicked() {
    console.log('Cédula catastral: ', this.realEstate.cadastralID);
  }


  onCadastralClicked() {
    if (!this.editionMode || this.submitted) {
      return;
    }

    if (this.realEstate.cadastralID) {
      this.unlinkCadastralId();
    } else {
      this.linkCadastralId();
    }
  }


  onStatusChange(change) {
    this.setRequiredFormFields(change.status === 'Completed');
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


  private linkCadastralId() {
    console.log('Vincular clave catastral: ', this.formHandler.getControl(this.controls.cadastralID).value);
  }


  private unlinkCadastralId() {
    console.log('Desvincular clave catastral: ', this.realEstate.cadastralID);
  }


  private initForm() {
    if (this.formHandler) {
      return;
    }

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
        status: new FormControl(''),
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
      cadastreLinkingDate: this.realEstate.cadastreLinkingDate || '',
      recorderOfficeUID: isEmpty(this.realEstate.recorderOffice) ? '' : this.realEstate.recorderOffice.uid,
      municipalityUID: isEmpty(this.realEstate.municipality) ? '' : this.realEstate.municipality.uid,
      resourceKindUID: this.realEstate.kind || '',
      lotSize: this.realEstate.lotSize || '',
      lotSizeUnitUID: isEmpty(this.realEstate.lotSizeUnit) ? '' : this.realEstate.lotSizeUnit.uid,
      description: this.realEstate.description || '',
      metesAndBounds: this.realEstate.metesAndBounds || '',
      status: this.realEstate.status,
    });
  }


  private loadDataLists() {
    this.helper.select<RecorderOffice[]>(RecordableSubjectsStateSelector.RECORDER_OFFICE_LIST)
      .subscribe(x => {
        this.recorderOfficeList = x;
        this.setRecorderOfficeAndMunicipalityDataList();
      });

    this.helper.select<string[]>(RecordableSubjectsStateSelector.REAL_ESTATE_KIND_LIST)
      .subscribe(x => {
        this.realEstateTypeList = x.map(item => Object.create({ name: item }));
      });

    this.helper.select<Identifiable[]>(RecordableSubjectsStateSelector.REAL_ESTATE_LOT_SIZE_UNIT_LIST)
      .subscribe(x => {
        this.lotSizeUnitList = x;
      });
  }


  private setRecorderOfficeAndMunicipalityDataList() {
    this.municipalityList = [];

    if (!isEmpty(this.realEstate.recorderOffice)) {
      const recorderOffice =
        this.recorderOfficeList.filter(x => x.uid === this.realEstate.recorderOffice.uid).length > 0 ?
          this.recorderOfficeList.filter(x => x.uid === this.realEstate.recorderOffice.uid)[0] : null;

      if (recorderOffice && recorderOffice.municipalities?.length > 0) {
        this.municipalityList = recorderOffice.municipalities;
      }

      this.recorderOfficeList = ArrayLibrary.insertIfNotExist(this.recorderOfficeList,
        this.realEstate.recorderOffice as RecorderOffice, 'uid');
    }

    if (!isEmpty(this.realEstate.municipality)) {
      this.municipalityList = ArrayLibrary.insertIfNotExist(this.municipalityList,
        this.realEstate.municipality, 'uid');
    }
  }


  private disableForm(disable) {
    this.formHandler.disableForm(disable);
    this.formHandler.disableControl(this.controls.electronicID);
    this.formHandler.disableControl(this.controls.cadastreLinkingDate);
  }


  private setRequiredFormFields(required: boolean) {
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


  private getFormData(): RealEstateFields {
    Assertion.assert(this.formHandler.form.valid,
      'Programming error: form must be validated before command execution.');

    const formModel = this.formHandler.form.getRawValue();

    const data: RealEstateFields = {
      uid: this.realEstate.uid,
      type: 'RealEstate',
      electronicID: formModel.electronicID ?? '',
      cadastralID: formModel.cadastralID ?? '',
      recorderOfficeUID: formModel.recorderOfficeUID ?? '',
      municipalityUID: formModel.municipalityUID ?? '',
      kind: formModel.resourceKindUID ?? '',
      lotSize: +formModel.lotSize ? formModel.lotSize : 0,
      lotSizeUnitUID: formModel.lotSizeUnitUID ?? '',
      description: formModel.description ?? '',
      metesAndBounds: formModel.metesAndBounds ?? '',
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
