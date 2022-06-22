/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordableSubjectsTableComponent } from './recordable-subjects-table.component';

describe('RecordableSubjectsTableComponent', () => {
  let component: RecordableSubjectsTableComponent;
  let fixture: ComponentFixture<RecordableSubjectsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecordableSubjectsTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordableSubjectsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
