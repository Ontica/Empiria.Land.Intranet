import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordingBookHeaderComponent } from './recording-book-header.component';

describe('RecordingBookHeaderComponent', () => {
  let component: RecordingBookHeaderComponent;
  let fixture: ComponentFixture<RecordingBookHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecordingBookHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordingBookHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
