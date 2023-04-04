/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, EventInfo, Identifiable, isEmpty, Validate } from '@app/core';

import { EmptyParty, Party, PartyFields, RecordingActPartyFields, RecordingActPartyType,
         RoleItem } from '@app/models';

import { FormHelper, sendEvent } from '@app/shared/utils';

export enum PartyEditorEventType {
  ADD_PARTY = 'PartyEditorComponent.Event.AddParty',
}

interface PartyFormModel extends FormGroup<{
  fullName: FormControl<string>;
  curp: FormControl<string>;
  rfc: FormControl<string>;
  partyNotes: FormControl<string>;
  roleUID: FormControl<string>;
  partUnitUID: FormControl<string>;
  partAmount: FormControl<string>;
  notes: FormControl<string>;
  associatedWithUID: FormControl<string>;
}> { }

@Component({
  selector: 'emp-land-party-editor',
  templateUrl: './party-editor.component.html'
})
export class PartyEditorComponent implements OnChanges {

  @Input() partySelected: Party = EmptyParty;

  @Input() partUnits: Identifiable[] = [];

  @Input() primaryPartyRoles: Identifiable[] = [];

  @Input() secondaryPartyRoles: Identifiable[] = [];

  @Input() partiesInRecordingActList: Party[] = [];

  @Output() partyEditorEvent = new EventEmitter<EventInfo>();

  form: PartyFormModel;

  formHelper = FormHelper;

  rolesList: RoleItem[] = [];

  typeRoleSelected: RecordingActPartyType = null;

  constructor() {
    this.initForm();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.partySelected) {
      this.setFormData();
    }

    this.setRoleList();
  }


  get isPerson(): boolean { return this.partySelected?.type === 'Person'; }


  get isAmountRequired() {
    return ['Unit.Percentage',
            'AreaUnit.SquareMeters',
            'AreaUnit.Hectarea',
            'Unit.Fraction'].includes(this.form.value.partUnitUID);
  }


  get isPartAmountFraction(): boolean {
    return this.form.value.partUnitUID === 'Unit.Fraction';
  }


  getRoleTypeSelected(): string {
    const roleType = this.rolesList.find(x => x.items.some(y => y.uid === this.form.value.roleUID));
    return isEmpty(roleType) ? null : roleType.uid;
  }


  onRoleChanges(role: RoleItem) {
    if (this.primaryPartyRoles.some(x => x.uid === role?.uid) ) {
      this.typeRoleSelected = 'Primary';
    } else if (this.secondaryPartyRoles.some(x => x.uid === role?.uid)) {
      this.typeRoleSelected = 'Secondary';
    } else {
      this.typeRoleSelected = null;
    }

    this.setRoleValidators();
  }


  onPartUnitChanges(partUnit: Identifiable) {
    this.form.controls.partAmount.reset();
    this.formHelper.clearControlValidators(this.form.controls.partAmount);

    if (this.isAmountRequired) {
      const validators = this.isPartAmountFraction ?
        [Validators.required, Validate.fractionValue] : [Validators.required];

      this.formHelper.setControlValidators(this.form.controls.partAmount, validators);
    }
  }


  onSubmitClicked() {
    if (this.formHelper.isFormReadyAndInvalidate(this.form)) {
      // console.log(this.getFormData())
      sendEvent(this.partyEditorEvent, PartyEditorEventType.ADD_PARTY, {party: this.getFormData()});
    }
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      fullName: ['', [Validators.required] ],
      curp: ['', [Validators.minLength(18), Validators.maxLength(18)]],
      rfc: [''],
      partyNotes: [''],
      roleUID: ['', Validators.required],
      partUnitUID: [''],
      partAmount: [''],
      notes: [''],
      associatedWithUID: [''],
    });
  }


  private setFormData() {
    this.form.reset();
    this.setPartyFields();
    this.setRfcValidators();
  }


  private setPartyFields() {
    const partySaved = !isEmpty(this.partySelected);

    const partyFields = {
      uid: partySaved ? this.partySelected.uid : '',
      type: partySaved ? this.partySelected.type : '',
      fullName: this.partySelected.fullName,
      curp: partySaved ? this.partySelected.curp : '',
      rfc: partySaved ? this.partySelected.rfc : '',
    };

    this.form.reset(partyFields);

    this.formHelper.setDisableControl(this.form.controls.fullName, partySaved);
    this.formHelper.setDisableControl(this.form.controls.curp, partySaved);
    this.formHelper.setDisableControl(this.form.controls.rfc, partySaved);
  }


  private setRoleList() {
    this.rolesList = [];

    if (this.primaryPartyRoles && this.primaryPartyRoles.length > 0){
      this.rolesList.push({uid: 'Primary', name: 'Primario', items: this.primaryPartyRoles});
    }

    if (this.secondaryPartyRoles && this.secondaryPartyRoles.length > 0){
      this.rolesList.push({uid: 'Secondary', name: 'Secundarios', items: this.secondaryPartyRoles});
    }
  }


  private setRfcValidators(){
    const validators = this.isPerson ? [Validators.minLength(13), Validators.maxLength(13)] :
      [Validators.minLength(12), Validators.maxLength(12)];

    this.formHelper.setControlValidators(this.form.controls.rfc, validators);
  }


  private setRoleValidators(){
    this.form.controls.partUnitUID.reset();
    this.form.controls.partAmount.reset();
    this.form.controls.associatedWithUID.reset();

    switch (this.typeRoleSelected) {
      case 'Primary':
        this.formHelper.setControlValidators(this.form.controls.partUnitUID, [Validators.required]);
        this.formHelper.clearControlValidators(this.form.controls.partAmount);
        this.formHelper.clearControlValidators(this.form.controls.associatedWithUID);
        break;
      case 'Secondary':
        this.formHelper.clearControlValidators(this.form.controls.partUnitUID);
        this.formHelper.clearControlValidators(this.form.controls.partAmount);
        this.formHelper.setControlValidators(this.form.controls.associatedWithUID, [Validators.required]);
        break;
    }
  }


  private getFormData(): RecordingActPartyFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const formModel = this.form.getRawValue();

    const data: RecordingActPartyFields = {
      uid: '',
      type: this.typeRoleSelected,
      party: this.getPartyFields(),
      roleUID: formModel.roleUID ?? '',
      notes: formModel.notes ?? '',
      partAmount: !!formModel.partAmount ? formModel.partAmount.toString() : '',
      partUnitUID: formModel.partUnitUID ?? '',
      associatedWithUID: formModel.associatedWithUID,
    };

    return data;
  }


  private getPartyFields(): PartyFields {
    const formModel = this.form.getRawValue();

    const party: PartyFields = {
      uid: isEmpty(this.partySelected) ? '' : this.partySelected.uid,
      type: this.partySelected.type,
      fullName: formModel.fullName.toString().toUpperCase(),
      curp: formModel.curp ? formModel.curp.toString().toUpperCase() : '',
      rfc: formModel.rfc ? formModel.rfc.toString().toUpperCase() : '',
      notes: formModel.partyNotes ?? ''
    };

    return party;
  }

}
