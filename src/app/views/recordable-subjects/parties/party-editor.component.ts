/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

import { Assertion, EventInfo, Identifiable, isEmpty, Validate } from '@app/core';

import { EmptyParty, Party, PartyFields, RecordingActPartyFields, RecordingActPartyType } from '@app/models';

import { FormHandler, sendEvent } from '@app/shared/utils';

enum PartyFormControls {
  fullName = 'fullName',
  curp = 'curp',
  rfc = 'rfc',
  partyNotes = 'partyNotes',
  roleUID = 'roleUID',
  partUnitUID = 'partUnitUID',
  partAmount = 'partAmount',
  notes = 'notes',
  associatedWithUID = 'associatedWithUID',
}

export enum PartyEditorEventType {
  ADD_PARTY = 'PartyEditorComponent.Event.AddParty',
}

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

  formHandler: FormHandler;

  controls = PartyFormControls;

  rolesList: any[] = [];

  typeRoleSelected: RecordingActPartyType = null;

  constructor() {
    this.initForm();
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes.partySelected) {
      this.setFormData();
    }

    this.setRoleList();
  }


  get isPerson() { return this.partySelected?.type === 'Person'; }


  get isPartAmountFraction() {
    return this.formHandler.getControl(this.controls.partUnitUID).value === 'Unit.Fraction';
  }


  getRoleTypeSelected() {
    const roleType = this.rolesList.filter(x =>
      !!x.items.find(y => y.uid === this.formHandler.getControl(this.controls.roleUID).value));

    if (roleType.length > 0) {
      return roleType[0].uid;
    } else {
      return null;
    }
  }


  onRoleChanges(role) {
    if (this.primaryPartyRoles.filter(x => x.uid === role?.uid).length > 0 ) {
      this.typeRoleSelected = 'Primary';
    } else if (this.secondaryPartyRoles.filter(x => x.uid === role?.uid).length > 0 ) {
      this.typeRoleSelected = 'Secondary';
    } else {
      this.typeRoleSelected = null;
    }

    this.setRoleValidators();
  }


  onPartUnitChanges(partUnit: Identifiable) {
    this.formHandler.getControl(this.controls.partAmount).reset();
    this.formHandler.clearControlValidators(this.controls.partAmount);

    if (this.validatePartUnitUIDWithAmount()) {
      const validators = this.isPartAmountFraction ?
        [Validators.required, Validate.fractionValue] : [Validators.required];

      this.formHandler.setControlValidators(this.controls.partAmount, validators);
    }
  }


  validatePartUnitUIDWithAmount() {
    const partUnit = this.formHandler.getControl(this.controls.partUnitUID).value;

    return ['Unit.Percentage',
            'AreaUnit.SquareMeters',
            'AreaUnit.Hectarea',
            'Unit.Fraction'].includes(partUnit);
  }


  submit() {
    if (!this.formHandler.validateReadyForSubmit()) {
      this.formHandler.invalidateForm();
      return;
    }

    sendEvent(this.partyEditorEvent, PartyEditorEventType.ADD_PARTY, { party: this.getFormData() });
  }


  private initForm() {
    this.formHandler = new FormHandler(
      new UntypedFormGroup({
        fullName: new UntypedFormControl({value: '', disabled: false}, Validators.required),
        curp: new UntypedFormControl({value: '', disabled: false}, [Validators.minLength(18),
                                                             Validators.maxLength(18)]),
        rfc: new UntypedFormControl({ value: '', disabled: false }),
        partyNotes: new UntypedFormControl(''),
        roleUID: new UntypedFormControl(null, Validators.required),
        partUnitUID: new UntypedFormControl(''),
        partAmount: new UntypedFormControl(''),
        notes: new UntypedFormControl(''),
        associatedWithUID: new UntypedFormControl([]),
      }));
  }


  private setFormData() {
    this.formHandler.form.reset();
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

    this.formHandler.form.reset(partyFields);

    this.formHandler.disableControl(this.controls.fullName, partySaved);
    this.formHandler.disableControl(this.controls.curp, partySaved);
    this.formHandler.disableControl(this.controls.rfc, partySaved);
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

    this.formHandler.setControlValidators(this.controls.rfc, validators);
  }


  private setRoleValidators(){
    this.formHandler.getControl(this.controls.partUnitUID).reset();
    this.formHandler.getControl(this.controls.partAmount).reset();
    this.formHandler.getControl(this.controls.associatedWithUID).reset();

    if (this.typeRoleSelected === 'Primary') {
      this.formHandler.setControlValidators(this.controls.partUnitUID, [Validators.required]);
      this.formHandler.clearControlValidators(this.controls.partAmount);
      this.formHandler.clearControlValidators(this.controls.associatedWithUID);
    } else if (this.typeRoleSelected === 'Secondary') {
      this.formHandler.clearControlValidators(this.controls.partUnitUID);
      this.formHandler.clearControlValidators(this.controls.partAmount);
      this.formHandler.setControlValidators(this.controls.associatedWithUID, [Validators.required]);
    }
  }


  private getFormData(): RecordingActPartyFields {
    Assertion.assert(this.formHandler.form.valid,
      'Programming error: form must be validated before command execution.');

    const formModel = this.formHandler.form.getRawValue();

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
    const formModel = this.formHandler.form.getRawValue();

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
