/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output,
         SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { combineLatest } from 'rxjs';

import { Assertion, DateString, EventInfo, Identifiable, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { RecordableSubjectsStateSelector } from '@app/presentation/exported.presentation.types';

import { EmptyRealEstate, RealEstate, RealEstateFields, RecordableObjectStatus, RecordableObjectStatusItem,
         RecordableObjectStatusList, RecordableSubjectType, RecorderOffice } from '@app/models';

import { ArrayLibrary, FormHelper, sendEvent } from '@app/shared/utils';

export enum RealEstateEditorComponentEventType {
  UPDATE_REAL_ESTATE = 'RealEstateEditorComponent.Event.UpdateRealEstate',
}

interface RealEstateFormModel extends FormGroup<{
  electronicID: FormControl<string>;
  cadastralID: FormControl<string>;
  cadastreLinkingDate: FormControl<DateString>;
  recorderOfficeUID: FormControl<string>;
  municipalityUID: FormControl<string>;
  kind: FormControl<string>;
  lotSizeUnitUID: FormControl<string>;
  lotSize: FormControl<number>;
  buildingArea: FormControl<number>;
  undividedPct: FormControl<number>;
  section: FormControl<string>;
  block: FormControl<string>;
  lot: FormControl<string>;
  description: FormControl<string>;
  metesAndBounds: FormControl<string>;
  status: FormControl<RecordableObjectStatus>;
}> { }

@Component({
  selector: 'emp-land-real-estate-editor',
  templateUrl: './real-estate-editor.component.html'
})
export class RealEstateEditorComponent implements OnInit, OnChanges, OnDestroy {

  @Input() instrumentRecordingUID = '';

  @Input() recordingActUID = '';

  @Input() realEstate: RealEstate = EmptyRealEstate;

  @Input() readonly = false;

  @Input() showElectronicHistoryButton = true;

  @Output() realEstateEditorEvent = new EventEmitter<EventInfo>();

  helper: SubscriptionHelper;

  form: RealEstateFormModel;

  formHelper = FormHelper;

  editionMode = false;

  isLoading = false;

  recorderOfficeList: RecorderOffice[] = [];

  municipalityList: Identifiable[] = [];

  realEstateKindList: string[] = [];

  lotSizeUnitList: Identifiable[] = [];

  statusList: RecordableObjectStatusItem[] = RecordableObjectStatusList;


  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
    this.initForm();
  }


  ngOnInit() {
    this.loadDataLists();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.realEstate) {
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

    this.setRecorderOfficeAndMunicipalityDataList();
    this.setRequiredFormFields(this.realEstate.status === 'Registered');
    this.setDisableForm(!this.editionMode);
  }


  onRecorderOfficeChanges(recorderOffice: RecorderOffice) {
    this.municipalityList = recorderOffice?.municipalities ?? [];
    this.form.controls.municipalityUID.reset();
  }


  onStatusChanges(change: RecordableObjectStatusItem) {
    this.setRequiredFormFields(change.status === 'Registered');
    this.formHelper.markFormControlsAsTouched(this.form);
  }


  onElectronicHistoryClicked() {
    console.log('Historia del folio real: ', this.realEstate.electronicID);
  }


  onCadastralCertificateClicked() {
    console.log('Cédula catastral: ', this.realEstate.cadastralID);
  }


  onCadastralClicked() {
    if (!this.editionMode) {
      return;
    }

    if (this.realEstate.cadastralID) {
      this.unlinkCadastralId();
    } else {
      this.linkCadastralId();
    }
  }


  onSubmitClicked() {
    if (this.formHelper.isFormReadyAndInvalidate(this.form)) {
      const payload = {
        instrumentRecordingUID: this.instrumentRecordingUID,
        recordingActUID: this.recordingActUID,
        recordableSubjectFields: this.getFormData(),
      };

      sendEvent(this.realEstateEditorEvent, RealEstateEditorComponentEventType.UPDATE_REAL_ESTATE, payload);
    }
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      electronicID: ['', Validators.required],
      cadastralID: [''],
      cadastreLinkingDate: [null],
      recorderOfficeUID: [''],
      municipalityUID: [''],
      kind: [''],
      lotSizeUnitUID: [''],
      lotSize: [0, Validators.min(0)],
      buildingArea: [0, Validators.min(0) ],
      undividedPct: [0, Validators.min(0)],
      section: [''],
      block: [''],
      lot: [''],
      description: [''],
      metesAndBounds: [''],
      status: [null],
    });
  }


  private setFormData() {
    if (!this.realEstate) {
      this.form.reset();
      return;
    }

    this.form.reset({
      electronicID: this.realEstate.electronicID || '',
      cadastralID: this.realEstate.cadastralID || '',
      cadastreLinkingDate: this.realEstate.cadastreLinkingDate || '',
      recorderOfficeUID: isEmpty(this.realEstate.recorderOffice) ? '' : this.realEstate.recorderOffice.uid,
      municipalityUID: isEmpty(this.realEstate.municipality) ? '' : this.realEstate.municipality.uid,
      kind: this.realEstate.kind || '',
      lotSizeUnitUID: isEmpty(this.realEstate.lotSizeUnit) ? '' : this.realEstate.lotSizeUnit.uid,
      lotSize: this.realEstate.lotSize || null,
      buildingArea: this.realEstate.buildingArea || null,
      undividedPct: this.realEstate.undividedPct || null,
      section: this.realEstate.section || '',
      block: this.realEstate.block || '',
      lot: this.realEstate.lot || '',
      description: this.realEstate.description || '',
      metesAndBounds: this.realEstate.metesAndBounds || '',
      status: this.realEstate.status,
    });
  }


  private loadDataLists() {
    this.isLoading = true;

    combineLatest([
      this.helper.select<RecorderOffice[]>(RecordableSubjectsStateSelector.RECORDER_OFFICE_LIST),
      this.helper.select<string[]>(RecordableSubjectsStateSelector.REAL_ESTATE_KIND_LIST),
      this.helper.select<Identifiable[]>(RecordableSubjectsStateSelector.REAL_ESTATE_LOT_SIZE_UNIT_LIST),
    ])
    .subscribe(([a, b, c]) => {
      this.recorderOfficeList = a;
      this.realEstateKindList = b.map(item => Object.create({ name: item }));
      this.lotSizeUnitList = c;

      this.setRecorderOfficeAndMunicipalityDataList();
      this.isLoading = false;
    });
  }


  private setRecorderOfficeAndMunicipalityDataList() {
    this.municipalityList = [];

    if (!isEmpty(this.realEstate.recorderOffice)) {
      const recorderOffice =
        this.recorderOfficeList.find(x => x.uid === this.realEstate.recorderOffice.uid) ?? null;

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


  private setDisableForm(disable: boolean) {
    this.formHelper.setDisableForm(this.form, disable);
    this.formHelper.setDisableControl(this.form.controls.electronicID);
    this.formHelper.setDisableControl(this.form.controls.cadastreLinkingDate);
  }


  private setRequiredFormFields(required: boolean) {
    if (required) {
      this.formHelper.setControlValidators(this.form.controls.cadastralID, Validators.required);
      this.formHelper.setControlValidators(this.form.controls.recorderOfficeUID, Validators.required);
      this.formHelper.setControlValidators(this.form.controls.municipalityUID, Validators.required);
      this.formHelper.setControlValidators(this.form.controls.kind, Validators.required);
      this.formHelper.setControlValidators(this.form.controls.lotSizeUnitUID, Validators.required);
      this.formHelper.setControlValidators(this.form.controls.lotSize, [Validators.required, Validators.min(0)]);
      this.formHelper.setControlValidators(this.form.controls.description, Validators.required);
      this.formHelper.setControlValidators(this.form.controls.metesAndBounds, Validators.required);
    } else {
      this.formHelper.setControlValidators(this.form.controls.recorderOfficeUID, Validators.required);
      this.formHelper.setControlValidators(this.form.controls.municipalityUID, Validators.required);
      this.formHelper.setControlValidators(this.form.controls.lotSizeUnitUID, Validators.required);
      this.formHelper.setControlValidators(this.form.controls.lotSize, Validators.min(0));
      this.formHelper.clearControlValidators(this.form.controls.cadastralID);
      this.formHelper.clearControlValidators(this.form.controls.kind);
      this.formHelper.clearControlValidators(this.form.controls.description);
      this.formHelper.clearControlValidators(this.form.controls.metesAndBounds);
    }
  }


  private linkCadastralId() {
    console.log('Vincular clave catastral: ', this.form.value.cadastralID);
  }


  private unlinkCadastralId() {
    console.log('Desvincular clave catastral: ', this.realEstate.cadastralID);
  }


  private getFormData(): RealEstateFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const formModel = this.form.getRawValue();

    const data: RealEstateFields = {
      uid: this.realEstate.uid,
      type: RecordableSubjectType.RealEstate,
      electronicID: formModel.electronicID ?? '',
      cadastralID: formModel.cadastralID ?? '',
      recorderOfficeUID: formModel.recorderOfficeUID ?? '',
      municipalityUID: formModel.municipalityUID ?? '',
      kind: formModel.kind ?? '',
      lotSizeUnitUID: formModel.lotSizeUnitUID ?? '',
      lotSize: formModel.lotSize ?? 0,
      buildingArea: formModel.buildingArea ?? 0,
      undividedPct: formModel.undividedPct ?? 0,
      section: formModel.section ?? '',
      block: formModel.block ?? '',
      lot: formModel.lot ?? '',
      description: formModel.description ?? '',
      metesAndBounds: formModel.metesAndBounds ?? '',
      status: formModel.status,
    };

    return data;
  }

}
