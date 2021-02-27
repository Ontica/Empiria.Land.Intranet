/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreprocessingComponent } from './preprocessing.component';

describe('PreprocessingComponent', () => {
  let component: PreprocessingComponent;
  let fixture: ComponentFixture<PreprocessingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreprocessingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreprocessingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
