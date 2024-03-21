/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ESignMainPageComponent } from './e-sign-main-page.component';

describe('ESignMainPageComponent', () => {
  let component: ESignMainPageComponent;
  let fixture: ComponentFixture<ESignMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ESignMainPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ESignMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
