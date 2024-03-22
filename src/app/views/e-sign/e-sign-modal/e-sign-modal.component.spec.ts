/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ESignModalComponent } from './e-sign-modal.component';

describe('ESignModalComponent', () => {
  let component: ESignModalComponent;
  let fixture: ComponentFixture<ESignModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ESignModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ESignModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
