import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookEntryListComponent } from './book-entry-list.component';

describe('BookEntryListComponent', () => {
  let component: BookEntryListComponent;
  let fixture: ComponentFixture<BookEntryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookEntryListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookEntryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
