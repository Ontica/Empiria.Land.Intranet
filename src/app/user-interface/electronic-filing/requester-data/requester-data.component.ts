/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Assertion } from '@app/core';

import { EmptyRequester, Requester, ProcedureType } from '@app/domain/models';


@Component({
  selector: 'emp-one-requester-data',
  templateUrl: './requester-data.component.html'
})
export class RequesterDataComponent implements OnChanges {

  @Input() procedureType: ProcedureType = 'NoDeterminado';

  @Input() requester: Requester = EmptyRequester;

  @Input() readonly = false;

  @Output() editRequester = new EventEmitter<Requester>();

  isLoading = false;

  form = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', Validators.email),
    rfc: new FormControl(''),
  });


  ngOnChanges() {
    this.resetForm();
  }


  get isReadyForSave() {
    return this.form.valid && !this.form.pristine && !this.readonly;
  }


  onSave() {
    this.sendEventRequesterDataEdited();
  }


  // private members


  private getFormData(): Requester {
    Assertion.assert(this.form.valid,
      'Programming error: form must be validated before command execution.');

    const formModel = this.form.value;

    const data = {
      name: (formModel.name as string).toUpperCase(),
      email: (formModel.email as string).toLowerCase(),
      rfc: (formModel.rfc as string).toUpperCase(),
    };

    return data;
  }


  private resetForm() {
    this.form.reset({
      name: this.requester.name,
      email: this.requester.email,
      rfc: this.requester.rfc
    });

    if (this.readonly) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }


  private sendEventRequesterDataEdited() {
    this.editRequester.emit(this.getFormData());
  }

}
