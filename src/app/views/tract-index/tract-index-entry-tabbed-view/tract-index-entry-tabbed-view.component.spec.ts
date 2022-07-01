/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TractIndexEntryTabbedViewComponent } from './tract-index-entry-tabbed-view.component';


describe('TractIndexEntryTabbedViewComponent', () => {
  let component: TractIndexEntryTabbedViewComponent;
  let fixture: ComponentFixture<TractIndexEntryTabbedViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TractIndexEntryTabbedViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TractIndexEntryTabbedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
