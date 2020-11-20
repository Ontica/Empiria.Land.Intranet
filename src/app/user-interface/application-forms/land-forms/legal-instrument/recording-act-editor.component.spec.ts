import {  ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RecordingActEditorComponent } from './recording-act-editor.component';

describe('RecordingActEditorComponent', () => {
  let component: RecordingActEditorComponent;
  let fixture: ComponentFixture<RecordingActEditorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordingActEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordingActEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
