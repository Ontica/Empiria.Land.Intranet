import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { concat, of, Subject } from 'rxjs';
import { catchError, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'emp-land-document-header',
  templateUrl: './document-header.component.html'
})
export class DocumentHeaderComponent implements OnInit {

  form: FormGroup;

  documentCategoriesList: any[];
  numberSheetsList: any[];

  notarias$: any;
  notariasInput$ = new Subject<string>();
  notariasLoading = false;

  editDocument = false;

  constructor() { }

  ngOnInit(): void {
    this.editDocument = false;
    this.setFormControls();
    this.loadData();
  }

  setFormControls = () => {
    this.form = new FormGroup({
      documentCategory: new FormControl({value: '', disabled: false}),
      notaria: new FormControl({value: '', disabled: false}),
      numberSheets: new FormControl({value: '', disabled: false}),
      description: new FormControl({value: '', disabled: false }, Validators.required),
    });
    this.disableFields(true);
  }

  get documentCategory(): any { return this.form.get('documentCategory'); }
  get numberSheets(): any { return this.form.get('numberSheets'); }
  get description(): any { return this.form.get('description'); }
  get notaria(): any { return this.form.get('notaria'); }


  disableFields(disable: boolean){
    if (disable){
      this.documentCategory.disable();
      this.numberSheets.disable();
      this.description.disable();
      this.notaria.disable();
    }else{
      this.documentCategory.enable();
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
    this.editDocument = !this.editDocument;
    this.disableFields(!this.editDocument);
  }
}
