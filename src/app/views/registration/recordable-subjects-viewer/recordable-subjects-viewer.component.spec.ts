/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordableSubjectsViewerComponent } from './recordable-subjects-viewer.component';

describe('RecordableSubjectsViewerComponent', () => {
  let component: RecordableSubjectsViewerComponent;
  let fixture: ComponentFixture<RecordableSubjectsViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecordableSubjectsViewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordableSubjectsViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
