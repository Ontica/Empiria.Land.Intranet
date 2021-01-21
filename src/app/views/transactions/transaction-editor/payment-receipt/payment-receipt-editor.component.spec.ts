import { CurrencyPipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PaymentReceiptEditorComponent } from './payment-receipt-editor.component';

describe('PaymentReceiptEditorComponent', () => {
  let component: PaymentReceiptEditorComponent;
  let fixture: ComponentFixture<PaymentReceiptEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule],
      declarations: [ PaymentReceiptEditorComponent ],
      providers: [ CurrencyPipe ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentReceiptEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form invalid when empty', () => {
    expect(component.formHandler.form.valid).toBeFalsy();
  });

  it('form valid', () => {
    expect(component.formHandler.form.valid).toBeFalsy();

    component.formHandler.getControl('paymentReceiptNo').setValue('9186');
    component.formHandler.getControl('total').setValue(869.00);

    expect(component.formHandler.form.valid).toBeTruthy();
  });
});
