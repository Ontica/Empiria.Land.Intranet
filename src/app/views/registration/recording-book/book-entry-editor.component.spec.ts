import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookEntryEditorComponent } from './book-entry-editor.component';

describe('BookEntryEditorComponent', () => {
  let component: BookEntryEditorComponent;
  let fixture: ComponentFixture<BookEntryEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookEntryEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookEntryEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
