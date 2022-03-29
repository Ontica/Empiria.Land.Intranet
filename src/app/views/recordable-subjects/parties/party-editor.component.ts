/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { EventInfo, Identifiable, isEmpty } from '@app/core';

import { EmptyParty, Party, RecordingActPartyFields, RecordingActPartyType } from '@app/models';

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

  form: FormGroup;

  rolesList: any[] = [];

  typeRoleSelected: RecordingActPartyType = null;

  constructor() {
    this.initFormControls();
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes.partySelected) {
      this.setFormData();
    }

    this.setRoleList();
  }


  get isPerson() { return this.partySelected?.type === 'Person'; }

  get fullName(): any { return this.form.get('fullName'); }
  get curp(): any { return this.form.get('curp'); }
  get rfc(): any { return this.form.get('rfc'); }
  get partyNotes(): any { return this.form.get('partyNotes'); }
  get roleUID(): any { return this.form.get('roleUID'); }
  get partUnitUID(): any { return this.form.get('partUnitUID'); }
  get partAmount(): any { return this.form.get('partAmount'); }
  get notes(): any { return this.form.get('notes'); }
  get associatedWithUID(): any { return this.form.get('associatedWithUID'); }


  getRoleTypeSelected() {
    const roleType = this.rolesList.filter(x => x.items.filter(y => y.uid === this.roleUID.value).length > 0);

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
    this.partAmount.setValue('');

    if (this.validatePartUnitUIDWithAmount(partUnit?.uid)) {
      this.partAmount.setValidators([Validators.required]);
    } else {
      this.partAmount.clearValidators();
    }

    this.partAmount.updateValueAndValidity();
  }


  validatePartUnitUIDWithAmount(value) {
    return ['Unit.Percentage', 'AreaUnit.SquareMeters', 'AreaUnit.Hectarea'].includes(value);
  }


  submit() {
    if (!this.form.valid) {
      this.invalidateForm();
      return;
    }

    this.sendEvent(PartyEditorEventType.ADD_PARTY, { party: this.getFormData() });
  }


  private initFormControls = () => {
    this.form = new FormGroup({
      fullName: new FormControl({ value: '', disabled: false }, Validators.required),
      curp: new FormControl({ value: '', disabled: false }, [Validators.minLength(18),
                                                             Validators.maxLength(18)]),
      rfc: new FormControl({ value: '', disabled: false }),
      partyNotes: new FormControl(''),
      roleUID: new FormControl(null, Validators.required),
      partUnitUID: new FormControl(''),
      partAmount: new FormControl(''),
      notes: new FormControl(''),
      associatedWithUID: new FormControl([]),
    });
  }


  private setFormData() {
    this.form.reset();

    if (!isEmpty(this.partySelected)) {
      this.form.patchValue({
        uid: this.partySelected.uid,
        type: this.partySelected.type,
        fullName: this.partySelected.fullName,
        curp: this.partySelected.curp,
        rfc: this.partySelected.rfc
      });
    } else {
      this.form.patchValue({ fullName: this.partySelected.fullName });
    }

    this.setRfcValidators();
    this.disablePartyFields(!isEmpty(this.partySelected));
  }


  private disablePartyFields(disable: boolean) {
    if (disable) {
      this.fullName.disable();
      this.curp.disable();
      this.rfc.disable();
    } else {
      this.fullName.enable();
      this.curp.enable();
      this.rfc.enable();
    }
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
    this.rfc.clearValidators();

    if (this.isPerson) {
      this.rfc.setValidators([Validators.minLength(13), Validators.maxLength(13)]);
    } else {
      this.rfc.setValidators([Validators.minLength(12), Validators.maxLength(12)]);
    }

    this.rfc.updateValueAndValidity();
  }


  private setRoleValidators(){
    this.partUnitUID.setValue('');
    this.partAmount.setValue('');
    this.associatedWithUID.setValue('');

    if (this.typeRoleSelected === 'Primary') {
      this.partUnitUID.setValidators([Validators.required]);
      this.partAmount.clearValidators();
      this.associatedWithUID.clearValidators();
    } else if (this.typeRoleSelected === 'Secondary') {
      this.partUnitUID.clearValidators();
      this.partAmount.clearValidators();
      this.associatedWithUID.setValidators([Validators.required]);
    }

    this.partUnitUID.updateValueAndValidity();
    this.partAmount.updateValueAndValidity();
    this.associatedWithUID.updateValueAndValidity();
  }


  private getFormData(): RecordingActPartyFields {
    const formModel = this.form.getRawValue();
    const data: RecordingActPartyFields = {
      uid: '',
      type: this.typeRoleSelected,
      party: {
        uid: isEmpty(this.partySelected) ? '' : this.partySelected.uid,
        type: this.partySelected.type,
        fullName: formModel.fullName.toString().toUpperCase(),
        curp: formModel.curp ? formModel.curp.toString().toUpperCase() : '',
        rfc: formModel.rfc ? formModel.rfc.toString().toUpperCase() : '',
        notes: formModel.partyNotes ?? ''
      },
      roleUID: formModel.roleUID ?? '',
      notes: formModel.notes ?? '',
      partAmount: formModel.partAmount ?? 0,
      partUnitUID: formModel.partUnitUID ?? '',
      associatedWithUID: formModel.associatedWithUID,
    };
    return data;
  }


  private invalidateForm = () => {
    Object.keys(this.form.controls).forEach(field => {
      const control = this.form.get(field);
      control.markAsTouched({ onlySelf: true });
    });
  }


  private sendEvent(eventType: PartyEditorEventType, payload?: any) {
    const event: EventInfo = {
      type: eventType,
      payload
    };

    this.partyEditorEvent.emit(event);
  }

}
