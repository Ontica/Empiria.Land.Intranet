import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordingBookEditorComponent } from './recording-book-editor.component';

describe('RecordingBookEditorComponent', () => {
  let component: RecordingBookEditorComponent;
  let fixture: ComponentFixture<RecordingBookEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecordingBookEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordingBookEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
