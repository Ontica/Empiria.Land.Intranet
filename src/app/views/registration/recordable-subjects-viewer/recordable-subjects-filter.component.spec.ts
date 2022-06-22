/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordableSubjectsFilterComponent } from './recordable-subjects-filter.component';


describe('RecordableSubjectsFilterComponent', () => {
  let component: RecordableSubjectsFilterComponent;
  let fixture: ComponentFixture<RecordableSubjectsFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecordableSubjectsFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordableSubjectsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
