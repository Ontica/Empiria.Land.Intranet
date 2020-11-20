/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SearchServicesMainPageComponent } from './search-services-main-page.component';


describe('SearchServicesMainPageComponent', () => {
  let component: SearchServicesMainPageComponent;
  let fixture: ComponentFixture<SearchServicesMainPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchServicesMainPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchServicesMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
