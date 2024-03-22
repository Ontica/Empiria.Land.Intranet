/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ESignFormComponent } from './e-sign-form.component';

describe('ESignFormComponent', () => {
  let component: ESignFormComponent;
  let fixture: ComponentFixture<ESignFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ESignFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ESignFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
