import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { concat, of, Subject } from 'rxjs';
import { catchError, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'emp-land-instrument-header',
  templateUrl: './instrument-header.component.html'
})
export class InstrumentHeaderComponent implements OnInit {

  form: FormGroup;

  instrumentCategoriesList: any[];
  numberSheetsList: any[];

  notarias$: any;
  notariasInput$ = new Subject<string>();
  notariasLoading = false;

  editInstrument = false;

  constructor() { }

  ngOnInit(): void {
    this.editInstrument = false;
    this.setFormControls();
    this.loadData();
  }

  setFormControls = () => {
    this.form = new FormGroup({
      instrumentCategory: new FormControl({value: '', disabled: false}),
      notaria: new FormControl({value: '', disabled: false}),
      numberSheets: new FormControl({value: '', disabled: false}),
      description: new FormControl({value: '', disabled: false }, Validators.required),
    });
    this.disableFields(true);
  }

  get instrumentCategory(): any { return this.form.get('instrumentCategory'); }
  get numberSheets(): any { return this.form.get('numberSheets'); }
  get description(): any { return this.form.get('description'); }
  get notaria(): any { return this.form.get('notaria'); }


  disableFields(disable: boolean){
    if (disable){
      this.instrumentCategory.disable();
      this.numberSheets.disable();
      this.description.disable();
      this.notaria.disable();
    }else{
      this.instrumentCategory.enable();
      this.numberSheets.enable();
      this.description.enable();
      this.notaria.enable();
    }
  }

  loadData(){
    this.notarias$ = concat(
      of([]),
      this.notariasInput$.pipe(
          distinctUntilChanged(),
          tap(() => this.notariasLoading = true),
          switchMap(term =>
            // TODO: call to web api
            of([])
          .pipe(
              catchError(() => of([])),
              tap(() => this.notariasLoading = false)
          ))
      )
    );
  }

  submit = () => {
    if (this.form.valid) {
      console.log(this.form.value);
    }
  }

  enableEditor(){
    this.editInstrument = !this.editInstrument;
    this.disableFields(!this.editInstrument);
  }
}
