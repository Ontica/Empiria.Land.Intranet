/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionControlsComponent } from './transaction-controls.component';

describe('TransactionControlsComponent', () => {
  let component: TransactionControlsComponent;
  let fixture: ComponentFixture<TransactionControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionControlsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
