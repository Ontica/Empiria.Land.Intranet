/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Empty, Identifiable } from '@app/core';

import { TransactionDescriptor } from '@app/models';

@Component({
  selector: 'emp-land-e-sign-modal',
  templateUrl: './e-sign-modal.component.html',
})
export class ESignModalComponent {

  @Input() operation: Identifiable = Empty;

  @Input() transactionList: TransactionDescriptor[] = [];

  @Output() closeEvent = new EventEmitter<void>();

  showPassword = false;

  submitted = false;

  form = new FormGroup({
    userID: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  exceptionMsg: string;


  onClose() {
    this.closeEvent.emit();
  }


  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }


  executeOperation() {
    this.submitted = true;

    setTimeout(() => {
      this.exceptionMsg = 'Funcionalidad en proceso de desarrollo.';
      this.submitted = false;
    }, 200);
  }

}
