/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { CurrencyPipe } from '@angular/common';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatDialogModule } from '@angular/material/dialog';

import { MessageBoxService } from '@app/shared/services';

import { TransactionSubmitterComponent } from './transaction-submitter.component';


describe('TransactionSubmitterComponent', () => {
  let component: TransactionSubmitterComponent;
  let fixture: ComponentFixture<TransactionSubmitterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, MatDialogModule],
      declarations: [TransactionSubmitterComponent],
      providers: [CurrencyPipe, MessageBoxService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionSubmitterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form invalid when empty', () => {
    expect(component.form.valid).toBeFalsy();
  });

  it('form valid', () => {
    expect(component.form.valid).toBeFalsy();

    component.form.controls.paymentReceiptNo.setValue('9186');
    component.form.controls.total.setValue('869.00');

    expect(component.form.valid).toBeTruthy();
  });
});
