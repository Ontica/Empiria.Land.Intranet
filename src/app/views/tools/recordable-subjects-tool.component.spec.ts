/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordableSubjectsToolComponent } from './recordable-subjects-tool.component';

describe('RecordableSubjectsToolComponent', () => {
  let component: RecordableSubjectsToolComponent;
  let fixture: ComponentFixture<RecordableSubjectsToolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecordableSubjectsToolComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordableSubjectsToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
