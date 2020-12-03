import { Component, HostListener, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatExpansionPanel } from '@angular/material/expansion';
import { NgSelectComponent, NgSelectConfig } from '@ng-select/ng-select';
import { concat, Observable, of, Subject } from 'rxjs';
import { catchError, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { participationTypeEnum, PartyTypesEnum, Person, RecordingActParty, RolesGroupEnum } from '@app/domain/models';


@Component({
  selector: 'emp-land-party-editor',
  templateUrl: './party-editor.component.html'
})
export class PartyEditorComponent implements OnInit {
  @ViewChild(MatExpansionPanel, {static: true}) matExpansionPanelElement: MatExpansionPanel;
  @ViewChildren(NgSelectComponent)  public ngSelects: QueryList<NgSelectComponent>;

  @Output() emitSaved = new Subject<boolean>();

  isLoading = false;

  parties$: Observable<Person[]>;
  partiesInput$ = new Subject<string>();
  isRegisteredParty: boolean = false;
  partiesLoading = false;
  selectedParty: RecordingActParty;

  showForm: boolean = false;
  form: FormGroup;
  selectedPartyType: any = null;

  partyTypesList: any[];
  identificationTypesList: any[];
  rolesList: any[];
  participationTypesList: any[];
  partiesInRecordingActList: any[];

  rolesGroup = RolesGroupEnum;

  constructor(private config: NgSelectConfig) {
    this.config.notFoundText = 'No se encontraron registros';
    this.config.appendTo = 'body';
  }

  ngOnInit(): void {
    this.selectedParty = null;
    this.selectedPartyType = null;
    this.isRegisteredParty = false;

    this.showForm = false;

    this.setFormControls();

    this.loadParties();
    this.loadFormSelectsData();
  }

  // if resize window we close the ng-select
  @HostListener('window:resize', ['$event'])
	onResize(event) {
		this.closeSelects();
	}

  //#region LOAD DATA
  loadParties() {
    this.parties$ = concat(
      of([]),
      this.partiesInput$.pipe(
          distinctUntilChanged(),
          tap(() => this.partiesLoading = true),
          switchMap(term => 
            //TODO: call to web api
            of([])
          .pipe(
              catchError(() => of([])),
              tap(() => this.partiesLoading = false)
          ))
      )
    );
  }

  loadFormSelectsData(){
    //TODO: suscribe to data
    this.partyTypesList = [];
    this.identificationTypesList = [];
    this.rolesList = [];
    this.participationTypesList = [];
    this.partiesInRecordingActList = [];
  }
  //#endregion

  //#region  FORM CONTROL
  setFormControls = () => {
    this.form = new FormGroup({
      name: new FormControl({value: '', disabled: false}, Validators.required),
      curp: new FormControl({value: '', disabled: false}),
      rfc: new FormControl({value: '', disabled: false}),
      typeIdentification: new FormControl({value: '', disabled: false}),
      identification: new FormControl({value: '', disabled: false}),
      notes: new FormControl(''),
      role: new FormControl('', Validators.required),
      participationType: new FormControl( ''),
      participationAmount: new FormControl(''),
      observations: new FormControl(''),
      of: new FormControl([]),
    });

    this.subscribeToValidators();
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

  subscribeToValidators(){
    this.role
        .valueChanges
        .subscribe(value => {
          if(value == RolesGroupEnum.primary) {
            this.participationType.setValidators([Validators.required]);
            this.participationAmount.clearValidators();
            this.of.clearValidators();
          } else {
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
          if(this.validateParticipationTypeWithAmount(value)) {
            this.participationAmount.setValidators([Validators.required]);
          } else {
            this.participationAmount.clearValidators();
          }
          this.participationAmount.updateValueAndValidity();
        });
  }

  resetForm(){
    this.form.reset();
    this.selectedParty = null;
    this.isRegisteredParty = false;
    this.selectedPartyType = null;

    this.showForm = false;
    this.isLoading = false;
  }

  setFormData(){
    this.showForm = true;
    this.isRegisteredParty = this.selectedParty && ( 'uid' in this.selectedParty ); //TODO: validate valid Uid 
    this.selectedParty.type = 'type' in this.selectedParty ? this.selectedParty.type : this.selectedPartyType ?? 1;
    this.form.reset();

    if(this.isRegisteredParty){
      this.form.patchValue({
        name: this.selectedParty?.name,
        curp: this.selectedParty?.curp,
        rfc: this.selectedParty?.identification.numberIdentification,
        typeIdentification: this.selectedParty?.identification.typeIdentification.uid,
        identification: this.selectedParty?.identification.numberIdentification,
      });

      this.name.disable();
      this.curp.disable();
      this.rfc.disable();
      this.typeIdentification.disable();
      this.identification.disable();
    }else{
      this.form.patchValue({
        name: this.selectedParty?.name,
      });

      this.name.enable();
      this.curp.enable();
      this.rfc.enable();
      this.typeIdentification.enable();
      this.identification.enable();
    }
  }
  //#endregion

  //#region SUBMIT DATA
  submit = () => {
    if(this.form.valid) {
      // TODO: confirm or reject submit
      this.isLoading = true;
      let partyAdd: RecordingActParty = this.getFormData();
      this.validateData(partyAdd);
      // TODO: save Party
      console.log(partyAdd);
      this.effectOfSaved();
    } else {
      this.invalidateForm();
    }
  }

  validateData(partyAdd: RecordingActParty){
    let message = ''
    //TODO: return message to alert from data with format not valid and show confirm save data
    if(partyAdd.curp != null && !curpValida(partyAdd.curp))
      message = `La Curp no es valida: ${partyAdd.curp}. `
 
    if(partyAdd.identification.typeIdentification.uid == '2' && !validateRFC(partyAdd.identification.numberIdentification))
      message = `El RFC no es valido:  ${partyAdd.identification.numberIdentification}. `;

    console.log(message);
    return message
  }

  effectOfSaved(){
    setTimeout(() => {
      this.emitSaved.next(true);
      this.resetForm();
      this.matExpansionPanelElement.toggle();
    }, 500);
  }

  getFormData(){
    let formModel = this.form.getRawValue();

    const data: RecordingActParty = {
      uid: this.selectedParty.uid,
      name: formModel.name.toString().toUpperCase(),
      curp: formModel.curp ? formModel.curp.toString().toUpperCase() : '' ,
      governmentID: '',
      governmentIDType: '',
      identification: {
        typeIdentification: this.selectedParty.type == PartyTypesEnum.person ? 
                            this.identificationTypesList.filter(x=>x.uid == formModel.typeIdentification)[0] ?? {uid: '', name: ''}: 
                            {uid: '2', name: 'RFC'},
        numberIdentification: this.selectedParty.type == PartyTypesEnum.person ? 
                              formModel.identification ? formModel.identification.toString().toUpperCase() : '' : 
                              formModel.rfc ? formModel.rfc.toString().toUpperCase() : '',
      },
      type: this.selectedParty.type,
      notes: formModel.notes,
      role: this.getListItemsFromGroup(this.rolesList).filter(x=>x.uid == formModel.role)[0],
      participationType: this.participationTypesList.filter(x=>x.uid == formModel.participationType)[0],
      participationAmount: formModel.participationAmount,
      observations: formModel.observations,
      of: formModel.of,
      partiesList: []
    }
    return data;
  }

  getListItemsFromGroup(list){
    return  list.map(x => x.items )
                .reduce((prev, current) => [...prev, ...current]);
  }

  invalidateForm = () => {
    Object.keys(this.form.controls).forEach(field => {
      const control = this.form.get(field);
      control.markAsTouched({ onlySelf: true });
    });
  }
  //#endregion

  //#region  COMPONENT LOGIC AND VALIDATIONS
  getRoleTypeSelected(){
    let roleType = this.rolesList.filter(x=> x.items.filter(y=> y.uid == this.role.value).length > 0);
    if (roleType.length > 0) return roleType[0].uid;
    else return null;
  }

  validateParticipationTypeWithAmount(value){
    return [participationTypeEnum.porcentaje, 
            participationTypeEnum.m2,
            participationTypeEnum.hectarea].includes(value) 
  }

  closeSelects(){
    this.ngSelects.filter( child => child.isOpen ).forEach( child => child.close() );
  }
  //#endregion
}

//#region function TODO: check if we use these functions and move them to a class or a pipe
//Función para validar una CURP
function curpValida(curp) {
    var re = /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/,
        validado = curp.match(re);
	
    if (!validado)  //Coincide con el formato general?
    	return false;
    
    //Validar que coincida el dígito verificador
    function digitoVerificador(curp17) {
        //Fuente https://consultas.curp.gob.mx/CurpSP/
        var diccionario  = "0123456789ABCDEFGHIJKLMNÑOPQRSTUVWXYZ",
            lngSuma      = 0.0,
            lngDigito    = 0.0;
        for(var i=0; i<17; i++)
            lngSuma = lngSuma + diccionario.indexOf(curp17.charAt(i)) * (18 - i);
        lngDigito = 10 - lngSuma % 10;
        if (lngDigito == 10) return 0;
        return lngDigito;
    }
  
    if (validado[2] != digitoVerificador(validado[1])) 
    	return false;
        
    return true; //valid
}

//Funcion que valida el RFC
function validateRFC(rfc) {
  // regex del sitio oficial del SAT para validar RFC
  var patternPM = "^(([A-ZÑ&]{3})([0-9]{2})([0][13578]|[1][02])(([0][1-9]|[12][\\d])|[3][01])([A-Z0-9]{3}))|" +
      "(([A-ZÑ&]{3})([0-9]{2})([0][13456789]|[1][012])(([0][1-9]|[12][\\d])|[3][0])([A-Z0-9]{3}))|" +
      "(([A-ZÑ&]{3})([02468][048]|[13579][26])[0][2]([0][1-9]|[12][\\d])([A-Z0-9]{3}))|" +
      "(([A-ZÑ&]{3})([0-9]{2})[0][2]([0][1-9]|[1][0-9]|[2][0-8])([A-Z0-9]{3}))$";
  var patternPF = "^(([A-ZÑ&]{4})([0-9]{2})([0][13578]|[1][02])(([0][1-9]|[12][\\d])|[3][01])([A-Z0-9]{3}))|" +
      "(([A-ZÑ&]{4})([0-9]{2})([0][13456789]|[1][012])(([0][1-9]|[12][\\d])|[3][0])([A-Z0-9]{3}))|" +
      "(([A-ZÑ&]{4})([02468][048]|[13579][26])[0][2]([0][1-9]|[12][\\d])([A-Z0-9]{3}))|" +
      "(([A-ZÑ&]{4})([0-9]{2})[0][2]([0][1-9]|[1][0-9]|[2][0-8])([A-Z0-9]{3}))$";

  if (rfc.match(patternPM) || rfc.match(patternPF)) {
      return true;
  } else {
      return false;
  }
}
//#endregion