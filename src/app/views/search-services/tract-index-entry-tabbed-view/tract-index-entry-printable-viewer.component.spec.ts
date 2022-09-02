/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TractIndexEntryPrintableViewerComponent } from './tract-index-entry-printable-viewer.component';


describe('TractIndexEntryPrintableViewerComponent', () => {
  let component: TractIndexEntryPrintableViewerComponent;
  let fixture: ComponentFixture<TractIndexEntryPrintableViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TractIndexEntryPrintableViewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TractIndexEntryPrintableViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
