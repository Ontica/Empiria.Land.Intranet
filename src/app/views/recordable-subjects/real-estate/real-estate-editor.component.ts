/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output,
         SimpleChanges } from '@angular/core';

import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

import { combineLatest } from 'rxjs';

import { Assertion, EventInfo, Identifiable, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { EmptyRealEstate, RealEstate, RecorderOffice } from '@app/models';

import { RealEstateFields, RecordableObjectStatusItem, RecordableObjectStatusList,
         RecordableSubjectType} from '@app/models/recordable-subjects';

import { RecordableSubjectsStateSelector } from '@app/presentation/exported.presentation.types';

import { ArrayLibrary, FormHandler, sendEvent } from '@app/shared/utils';

export enum RealEstateEditorComponentEventType {
  UPDATE_REAL_ESTATE = 'RealEstateEditorComponent.Event.UpdateRealEstate',
}

enum RealEstateEditorFormControls {
  electronicID = 'electronicID',
  cadastralID = 'cadastralID',
  cadastreLinkingDate = 'cadastreLinkingDate',
  recorderOfficeUID = 'recorderOfficeUID',
  municipalityUID = 'municipalityUID',
  kind = 'kind',
  lotSizeUnitUID = 'lotSizeUnitUID',
  lotSize = 'lotSize',
  buildingArea = 'buildingArea',
  undividedPct = 'undividedPct',
  section = 'section',
  block = 'block',
  lot = 'lot',
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

  @Input() instrumentRecordingUID = '';
  @Input() recordingActUID = '';
  @Input() realEstate: RealEstate = EmptyRealEstate;
  @Input() readonly = false;
  @Input() showElectronicHistoryButton = true;
  @Output() realEstateEditorEvent = new EventEmitter<EventInfo>();

  helper: SubscriptionHelper;

  formHandler: FormHandler;
  controls = RealEstateEditorFormControls;
  editionMode = false;
  isLoading = false;

  recorderOfficeList: RecorderOffice[] = [];
  municipalityList: Identifiable[] = [];
  realEstateKindList: string[] = [];
  lotSizeUnitList: Identifiable[] = [];
  statusList: RecordableObjectStatusItem[] = RecordableObjectStatusList;


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
    this.setRequiredFormFields(this.realEstate.status === 'Registered');
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
    if (!this.editionMode) {
      return;
    }

    if (this.realEstate.cadastralID) {
      this.unlinkCadastralId();
    } else {
      this.linkCadastralId();
    }
  }


  onStatusChange(change) {
    this.setRequiredFormFields(change.status === 'Registered');
    this.formHandler.invalidateForm();
  }


  onSubmitForm() {
    if (!this.formHandler.validateReadyForSubmit()) {
      this.formHandler.invalidateForm();
      return;
    }

    const payload = {
      instrumentRecordingUID: this.instrumentRecordingUID,
      recordingActUID: this.recordingActUID,
      recordableSubjectFields: this.getFormData()
    };

    sendEvent(this.realEstateEditorEvent, RealEstateEditorComponentEventType.UPDATE_REAL_ESTATE, payload);
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
      new UntypedFormGroup({
        electronicID: new UntypedFormControl(''),
        cadastralID: new UntypedFormControl(''),
        cadastreLinkingDate: new UntypedFormControl(''),
        recorderOfficeUID: new UntypedFormControl(''),
        municipalityUID: new UntypedFormControl(''),
        kind: new UntypedFormControl(''),
        lotSizeUnitUID: new UntypedFormControl(''),
        lotSize: new UntypedFormControl('', Validators.min(0)),
        buildingArea: new UntypedFormControl('', Validators.min(0)),
        undividedPct: new UntypedFormControl('', Validators.min(0)),
        section: new UntypedFormControl(''),
        block: new UntypedFormControl(''),
        lot: new UntypedFormControl(''),
        description: new UntypedFormControl(''),
        metesAndBounds: new UntypedFormControl(''),
        status: new UntypedFormControl(''),
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
      status: this.realEstate.status
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
      this.formHandler.setControlValidators('kind', Validators.required);
      this.formHandler.setControlValidators('lotSizeUnitUID', Validators.required);
      this.formHandler.setControlValidators('lotSize', [Validators.required, Validators.min(0)]);
      this.formHandler.setControlValidators('description', Validators.required);
      this.formHandler.setControlValidators('metesAndBounds', Validators.required);
    } else {
      this.formHandler.setControlValidators('recorderOfficeUID', Validators.required);
      this.formHandler.setControlValidators('municipalityUID', Validators.required);
      this.formHandler.setControlValidators('lotSizeUnitUID', Validators.required);
      this.formHandler.setControlValidators('lotSize', Validators.min(0));
      this.formHandler.clearControlValidators('cadastralID');
      this.formHandler.clearControlValidators('kind');
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
      status: formModel.status
    };

    return data;
  }

}
