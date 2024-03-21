/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandExplorerComponent } from './land-explorer.component';

describe('LandExplorerComponent', () => {
  let component: LandExplorerComponent;
  let fixture: ComponentFixture<LandExplorerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandExplorerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
