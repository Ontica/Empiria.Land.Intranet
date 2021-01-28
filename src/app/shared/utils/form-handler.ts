import { FormGroup } from '@angular/forms';


export class FormHandler {

  form: FormGroup;
  submitted = false;

  constructor(formGroup: FormGroup){
    this.form = formGroup;
  }

  get isValid(){
    return this.form.valid && this.form.dirty;
  }

  get isReadyForSubmit(){
    return !this.submitted && this.isValid;
  }

  getControl(name: string) {
    return this.form.get(name);
  }

  setFormModel(values: any) {
    this.form.reset(values);
    this.submitted = false;
  }

  showInvalidControl(name: string){
    return this.getControl(name).touched && !this.getControl(name).valid;
  }

  validateReadyForSubmit(){
    if (!this.isReadyForSubmit) {
      this.invalidateForm();
    }
    return this.isReadyForSubmit;
  }

  invalidateForm() {
    Object.keys(this.form.controls).forEach(field => {
      const control = this.form.get(field);
      control.markAsTouched({ onlySelf: true });
    });
  }

  resetForm() {
    this.form.reset();
    this.submitted = false;
  }

  disableForm(disable: boolean = true){
    if (disable) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  disableControl(name: string, disable: boolean = true){
    if (disable) {
      this.getControl(name).disable();
    } else {
      this.getControl(name).enable();
    }
  }

  setControlValidators(name: string, validator: any | any[]){
    this.getControl(name).clearValidators();
    this.getControl(name).setValidators(validator);
    this.getControl(name).updateValueAndValidity();
  }

}
