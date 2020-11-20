/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS,
         Validator, ValidationErrors, FormGroup, FormControl, Validators } from '@angular/forms';

import { PresentationState } from '@app/core/presentation';

import { EmptyRealEstate, RealEstate } from '@app/domain/models';

import { LandRepositoryStateSelector } from '@app/core/presentation/state.commands';


@Component({
  selector: 'emp-land-real-property-uid-picker',
  templateUrl: './real-property-uid-picker.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RealPropertyUIDPickerComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => RealPropertyUIDPickerComponent),
      multi: true
    }
  ]
})
export class RealPropertyUIDPickerComponent implements ControlValueAccessor, Validator {

  @Input() disabled = false;

  @Output() selectRealEstate = new EventEmitter<RealEstate>();

  form = new FormGroup({
    propertyUID: new FormControl('', Validators.required)
  });

  realEstate = EmptyRealEstate;

  errorMsg = '';

  isLoading = false;

  onChange = (propertyUID: string) => { };

  onTouched = () => { };

  onValidate = () => { };

  constructor(private store: PresentationState) {}


  registerOnChange(fn: (propertyUID: string) => void): void {
    this.onChange = fn;
  }


  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }


  registerOnValidatorChange?(fn: () => void): void {
    this.onValidate = fn;
  }


  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;

    if (this.disabled) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }


  validate(control: AbstractControl): ValidationErrors | null {
    if (this.form.disabled || this.form.valid) {
      return null;
    } else {
      return { valid: false };
    }
  }


  writeValue(propertyUID: string): void {
    if (propertyUID == null) {
      propertyUID = '';
    }

    if (typeof propertyUID !== 'string') {
      return;
    }

    this.form.get('propertyUID').setValue(propertyUID, { emitEvent : false });

    this.loadRealEstateData(propertyUID);
  }


  onReadRealEstateData() {
    let propertyUID = this.form.get('propertyUID').value;

    propertyUID = propertyUID.toUpperCase();

    if (!this.matchRealEstatePattern(propertyUID)) {
      this.realEstate = EmptyRealEstate;
      this.errorMsg = 'El folio real tiene un formato que no reconozco.';
      return;
    }

    this.loadRealEstateData(propertyUID)
      .then(() => {
        if (!this.errorMsg) {
          this.form.get('propertyUID').setValue(this.realEstate.uid);
          this.selectRealEstate.emit(this.realEstate);
          this.onChange(this.realEstate.uid);
        }
      })
      .finally(() => {
        this.onValidate();
      });
  }


  // private methods


  public get isDirty() {
    return this.form.get('propertyUID').value !== this.realEstate.uid;
  }


  private loadRealEstateData(propertyUID: string): Promise<void> {
    this.errorMsg = '';

    if (!propertyUID) {
      this.realEstate = EmptyRealEstate;
      return Promise.resolve();
    }

    this.isLoading = true;

    return this.store.select<RealEstate>(LandRepositoryStateSelector.REAL_ESTATE, { uid: propertyUID })
        .toPromise()
        .then(x => {
          this.realEstate = x;
          this.isLoading = false;
        })
        .catch(() => {
          this.realEstate = EmptyRealEstate;
          this.isLoading = false;

          this.errorMsg = 'No existe ningún predio con el folio real proporcionado.';
      });
  }


  private matchRealEstatePattern(propertyUID: string): boolean {
    const matched = propertyUID.match(/TL\d\d-[A-Z]\d[A-Z]\d-[A-Z][A-Z\d]\d[A-Z]-\d[A-Z]\d[A-Z\d]/g);
    if (matched && matched.length === 1) {
      return true;
    }
    return false;
  }

}
