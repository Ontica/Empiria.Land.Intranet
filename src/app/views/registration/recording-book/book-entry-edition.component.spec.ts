/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookEntryEditionComponent } from './book-entry-edition.component';

describe('BookEntryEditionComponent', () => {
  let component: BookEntryEditionComponent;
  let fixture: ComponentFixture<BookEntryEditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookEntryEditionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookEntryEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
