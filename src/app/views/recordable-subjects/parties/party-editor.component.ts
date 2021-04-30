/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Subject } from 'rxjs';

import { isEmpty } from '@app/core';

import { EmptyRecordingActParty, RecordingActParty, RecordingActPartyFields,
         RecordingActPartyType } from '@app/models';


@Component({
  selector: 'emp-land-party-editor',
  templateUrl: './party-editor.component.html'
})
export class PartyEditorComponent implements OnInit, OnChanges {

  @Input() partySelected: RecordingActParty = EmptyRecordingActParty;

  @Output() emitSaved = new Subject<boolean>();

  form: FormGroup;

  identificationTypesList: any[];
  rolesList: any[];
  participationTypesList: any[];
  partiesInRecordingActList: any[];

  rolesGroup: RecordingActPartyType;

  constructor() {
    this.initFormControls();
    this.loadFormSelectsData();
  }


  ngOnChanges(): void {
    this.setFormData();
  }


  ngOnInit(): void { }


  get isPerson() {
    return this.partySelected?.party?.type === 'Person';
  }


  get name(): any { return this.form.get('name'); }
  get curp(): any { return this.form.get('curp'); }
  get rfc(): any { return this.form.get('rfc'); }
  get typeIdentification(): any { return this.form.get('typeIdentification'); }
  get identification(): any { return this.form.get('identification'); }
  get notes(): any { return this.form.get('notes'); }
  get role(): any { return this.form.get('role'); }
  get participationType(): any { return this.form.get('participationType'); }
  get participationAmount(): any { return this.form.get('participationAmount'); }
  get observations(): any { return this.form.get('observations'); }
  get of(): any { return this.form.get('of'); }


  getRoleTypeSelected() {
    const roleType = this.rolesList.filter(x => x.items.filter(y => y.uid === this.role.value).length > 0);

    if (roleType.length > 0) {
      return roleType[0].uid;
    } else {
      return null;
    }
  }


  validateParticipationTypeWithAmount(value) {
    // return [participationTypeEnum.porcentaje,
    //         participationTypeEnum.m2,
    //         participationTypeEnum.hectarea].includes(value);
    return true;
  }


  submit = () => {
    if (this.form.valid) {
      const partyAdd: RecordingActPartyFields = this.getFormData();
      this.validateData(partyAdd);
      console.log(partyAdd); // TODO: emit party
    } else {
      this.invalidateForm();
    }
  }


  private loadFormSelectsData() {
    this.identificationTypesList = [];
    this.rolesList = [];
    this.participationTypesList = [];
    this.partiesInRecordingActList = [];
  }


  private initFormControls = () => {
    this.form = new FormGroup({
      name: new FormControl({ value: '', disabled: false }, Validators.required),
      curp: new FormControl({ value: '', disabled: false }),
      rfc: new FormControl({ value: '', disabled: false }),
      typeIdentification: new FormControl({ value: null, disabled: false }),
      identification: new FormControl({ value: '', disabled: false }),
      notes: new FormControl(''),
      role: new FormControl(null, Validators.required),
      participationType: new FormControl(''),
      participationAmount: new FormControl(''),
      observations: new FormControl(''),
      of: new FormControl([]),
    });

    this.subscribeToValidators();
  }


  private subscribeToValidators() {
    this.role
      .valueChanges
      .subscribe((value: RecordingActPartyType) => {
        if (value === 'Primary') {
          this.participationType.setValidators([Validators.required]);
          this.participationAmount.clearValidators();
          this.of.clearValidators();
        } else if (value === 'Secondary') {
          this.participationType.clearValidators();
          this.participationAmount.clearValidators();
          this.of.setValidators([Validators.required]);
        }
        this.participationType.updateValueAndValidity();
        this.participationAmount.updateValueAndValidity();
        this.of.updateValueAndValidity();
      });

    this.participationType
      .valueChanges
      .subscribe(value => {
        if (this.validateParticipationTypeWithAmount(value)) {
          this.participationAmount.setValidators([Validators.required]);
        } else {
          this.participationAmount.clearValidators();
        }
        this.participationAmount.updateValueAndValidity();
      });
  }


  private setFormData() {
    this.form.reset();

    if (!isEmpty(this.partySelected)) {
      this.form.patchValue({
        uid: this.partySelected.party.uid,
        type: this.partySelected.party.type,
        name: this.partySelected?.party.fullName,
        curp: this.partySelected?.party.curp,
        rfc: this.partySelected?.party.rfc
      });
    } else {
      this.form.patchValue({
        name: this.partySelected?.party.fullName,
      });
    }

    this.disablePartyFields(!isEmpty(this.partySelected));
  }


  private disablePartyFields(disable: boolean) {
    if (disable) {
      this.name.disable();
      this.curp.disable();
      this.rfc.disable();
      this.typeIdentification.disable();
      this.identification.disable();
    } else {
      this.name.enable();
      this.curp.enable();
      this.rfc.enable();
      this.typeIdentification.enable();
      this.identification.enable();
    }
  }


  private validateData(partyAdd: RecordingActPartyFields) {
    let message = '';
    // TODO: return message to alert from data with format not valid and show confirm save data
    if (partyAdd.party.curp && !curpValida(partyAdd.party.curp)) {
      message = `La Curp no es valida: ${partyAdd.party.curp}. `;
    }

    if (partyAdd.party.rfc && !validateRFC(partyAdd.party.rfc)) {
      message = `El RFC no es valido:  ${partyAdd.party.rfc}. `;
    }

    console.log(message);
    return message;
  }


  private getFormData(): RecordingActPartyFields {
    const formModel = this.form.getRawValue();
    const data: RecordingActPartyFields = {
      uid: this.partySelected.uid,
      type: this.partySelected.type,
      party: {
        uid: '',
        type: 'Organization', // check
        fullName: formModel.name.toString().toUpperCase(),
        curp: formModel.curp ? formModel.curp.toString().toUpperCase() : '',
        rfc: formModel.rfc,
        notes: formModel.notes
      },
      roleUID: formModel.role,
      notes: formModel.notes,
      partAmount: formModel.participationAmount,
      partUnitUID: formModel.participationType,
      associatedWithUID: formModel.of,
    };
    return data;
  }


  private invalidateForm = () => {
    Object.keys(this.form.controls).forEach(field => {
      const control = this.form.get(field);
      control.markAsTouched({ onlySelf: true });
    });
  }

}


function curpValida(curp) {
  const re = /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/;
  const validado = curp.match(re);
  if (!validado) { // Does it match the general format?
    return false;
  }
  // Validate that the check digit matches
  function digitoVerificador(curp17) {
    // Source https://consultas.curp.gob.mx/CurpSP/
    const diccionario = '0123456789ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
    let lngSuma = 0.0;
    let lngDigito = 0.0;

    for (let i = 0; i < 17; i++) {
      lngSuma = lngSuma + diccionario.indexOf(curp17.charAt(i)) * (18 - i);
    }
    lngDigito = 10 - lngSuma % 10;
    if (lngDigito === 10) {
      return 0;
    }
    return lngDigito;
  }

  if (validado[2] !== digitoVerificador(validado[1])) {
    return false;
  }
  return true;
}


function validateRFC(rfc) {
  // regex from the SAT official site to validate RFCs
  const patternPM = '^(([A-ZÑ&]{3})([0-9]{2})([0][13578]|[1][02])(([0][1-9]|[12][\\d])|[3][01])([A-Z0-9]{3}))|' +
    '(([A-ZÑ&]{3})([0-9]{2})([0][13456789]|[1][012])(([0][1-9]|[12][\\d])|[3][0])([A-Z0-9]{3}))|' +
    '(([A-ZÑ&]{3})([02468][048]|[13579][26])[0][2]([0][1-9]|[12][\\d])([A-Z0-9]{3}))|' +
    '(([A-ZÑ&]{3})([0-9]{2})[0][2]([0][1-9]|[1][0-9]|[2][0-8])([A-Z0-9]{3}))$';
  const patternPF = '^(([A-ZÑ&]{4})([0-9]{2})([0][13578]|[1][02])(([0][1-9]|[12][\\d])|[3][01])([A-Z0-9]{3}))|' +
    '(([A-ZÑ&]{4})([0-9]{2})([0][13456789]|[1][012])(([0][1-9]|[12][\\d])|[3][0])([A-Z0-9]{3}))|' +
    '(([A-ZÑ&]{4})([02468][048]|[13579][26])[0][2]([0][1-9]|[12][\\d])([A-Z0-9]{3}))|' +
    '(([A-ZÑ&]{4})([0-9]{2})[0][2]([0][1-9]|[1][0-9]|[2][0-8])([A-Z0-9]{3}))$';

  if (rfc.match(patternPM) || rfc.match(patternPF)) {
    return true;
  } else {
    return false;
  }
}
