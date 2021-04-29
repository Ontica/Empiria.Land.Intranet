import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordingActEditorComponent } from './recording-act-editor.component';

describe('RecordingActEditorComponent', () => {
  let component: RecordingActEditorComponent;
  let fixture: ComponentFixture<RecordingActEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecordingActEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordingActEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
