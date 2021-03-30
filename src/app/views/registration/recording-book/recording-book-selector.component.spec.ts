import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordingBookSelectorComponent } from './recording-book-selector.component';

describe('RecordingBookSelectorComponent', () => {
  let component: RecordingBookSelectorComponent;
  let fixture: ComponentFixture<RecordingBookSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecordingBookSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordingBookSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
